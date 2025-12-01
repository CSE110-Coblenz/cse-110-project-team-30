package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"cse-110-project-team-30/backend/internal/socket"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
)

type AuthMessage struct {
	Type  string `json:"type"`  // "auth"
	Token string `json:"token"` // JWT
}

type MatchMessage struct {
	Type   string `json:"type"` // "matched"
	RoomID string `json:"roomID"`
	Team   string `json:"team"` // "red" or "blue"
}

func RegisterNewGameWS(mux *http.ServeMux, bm *socket.BattleManager) {
	waitingQueue := make(chan *socket.PlayerConn, 100) // wrap conn with user info

	mux.HandleFunc("/newgamews", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("ws upgrade error:", err)
			return
		}

		// --- wait for first message for authentication ---
		_, msgBytes, err := conn.ReadMessage()
		if err != nil {
			log.Println("ws read message error:", err)
			conn.Close()
			return
		}

		var authMsg AuthMessage
		if err := json.Unmarshal(msgBytes, &authMsg); err != nil || authMsg.Type != "auth" || authMsg.Token == "" {
			log.Println("invalid auth message:", err)
			conn.Close()
			return
		}

		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			log.Println("JWT_SECRET not set")
			conn.Close()
			return
		}

		token, err := jwt.Parse(authMsg.Token, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			log.Println("invalid JWT token:", err)
			conn.Close()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			log.Println("invalid JWT claims")
			conn.Close()
			return
		}

		userID, _ := claims["id"].(string)
		username, _ := claims["username"].(string)
		player := &socket.PlayerConn{
			Conn:     conn,
			UserID:   userID,
			Username: username,
		}

		waitingQueue <- player
	})

	// --- matchmaking goroutine ---
	go func() {
		queue := []*socket.PlayerConn{}
		inQueue := map[string]*socket.PlayerConn{}
		log.Println("At least the logging works...")

		for {
			// Receive new waiting players
			select {
			case player := <-waitingQueue:
				if inQueue[player.UserID] != nil {
					log.Println("kick player")
					inQueue[player.UserID].Conn.Close()       // already in queue
					inQueue[player.UserID].Conn = player.Conn // update conn
				} else {
					log.Println("add player")
					queue = append(queue, player)
					inQueue[player.UserID] = player
				}
			}

			// Match players in pairs
			i := 0
			for i < len(queue)-1 {
				p1 := queue[i]
				p2 := queue[i+1]

				// skip if same user
				if p1.UserID == p2.UserID {
					i++
					continue
				}

				room := bm.CreateRoom()
				msg1 := MatchMessage{Type: "matched", RoomID: room.ID, Team: "red"}
				msg2 := MatchMessage{Type: "matched", RoomID: room.ID, Team: "blue"}
				data1, _ := json.Marshal(msg1)
				data2, _ := json.Marshal(msg2)

				// Try sending match message, skip disconnected players
				if err := p1.Conn.WriteMessage(websocket.TextMessage, data1); err != nil {
					log.Println("p1 disconnected, skipping:", err)
					p1.Conn.Close()
					queue = append(queue[:i], queue[i+1:]...) // remove p1
					inQueue[p1.UserID] = nil
					continue
				}
				if err := p2.Conn.WriteMessage(websocket.TextMessage, data2); err != nil {
					log.Println("p2 disconnected, skipping:", err)
					p2.Conn.Close()
					queue = append(queue[:i+1], queue[i+2:]...) // remove p2
					inQueue[p2.UserID] = nil
					continue
				}

				// Close matchmaking WS (client will connect to /ws/{roomID} next)
				log.Println("matched players:", p1.UserID, "vs", p2.UserID, "in room", room.ID)
				p1.Conn.Close()
				p2.Conn.Close()

				// Remove both players from queue
				queue = append(queue[:i], queue[i+2:]...)
				inQueue[p1.UserID] = nil
				inQueue[p2.UserID] = nil
			}
		}
	}()
}

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
			conn.Close()
			return
		}

		var authMsg AuthMessage
		if err := json.Unmarshal(msgBytes, &authMsg); err != nil || authMsg.Type != "auth" || authMsg.Token == "" {
			conn.Close()
			return
		}

		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
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
			conn.Close()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
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

		for {
			// Receive new waiting players
			select {
			case player := <-waitingQueue:
				queue = append(queue, player)
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
					continue
				}
				if err := p2.Conn.WriteMessage(websocket.TextMessage, data2); err != nil {
					log.Println("p2 disconnected, skipping:", err)
					p2.Conn.Close()
					queue = append(queue[:i+1], queue[i+2:]...) // remove p2
					continue
				}

				// Close matchmaking WS (client will connect to /ws/{roomID} next)
				p1.Conn.Close()
				p2.Conn.Close()

				// Remove both players from queue
				queue = append(queue[:i], queue[i+2:]...)
			}
		}
	}()
}

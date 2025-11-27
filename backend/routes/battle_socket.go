package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"cse-110-project-team-30/backend/internal/socket"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// First message struct for auth
type AuthMessage struct {
	Type  string `json:"type"`  // should be "auth"
	Token string `json:"token"` // JWT
}

func RegisterBattleSocket(mux *http.ServeMux, bm *socket.BattleManager) {
	mux.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		roomID := strings.TrimPrefix(r.URL.Path, "/ws/")
		room, ok := bm.GetRoom(roomID)
		if !ok || room.Hub == nil {
			http.Error(w, "room not found", http.StatusNotFound)
			return
		}
		hub := room.Hub

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		// --- Wait for first message for authentication ---
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
		fmt.Printf("User %s (%s) connected to room %s\n", username, userID, roomID)

		// Attach user info if your Hub supports it
		hub.AddClient(conn /* optionally pass user info */)
	})
}

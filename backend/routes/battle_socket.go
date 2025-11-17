package routes

import (
	"cse-110-project-team-30/backend/internal/socket"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func RegisterBattleSocket(mux *http.ServeMux, hub *socket.Hub) {
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		hub.AddClient(conn)
	})
}

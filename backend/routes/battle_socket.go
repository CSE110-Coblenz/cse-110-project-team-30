package routes

import (
	"net/http"
	"strings"

	"cse-110-project-team-30/backend/internal/socket"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
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

		hub.AddClient(conn)
	})
}

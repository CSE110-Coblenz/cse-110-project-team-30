package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"cse-110-project-team-30/backend/internal/socket"

	"github.com/gorilla/websocket"
)

type MatchMessage struct {
	Type   string `json:"type"` // "matched"
	RoomID string `json:"roomID"`
	Team   string `json:"team"` // "red" or "blue"
}

func RegisterNewGameWS(mux *http.ServeMux, bm *socket.BattleManager) {
	waitingQueue := make(chan *websocket.Conn, 100)

	mux.HandleFunc("/newgamews", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("ws upgrade error:", err)
			return
		}

		waitingQueue <- conn
	})

	go func() {
		queue := []*websocket.Conn{}

		for {
			select {
			case conn := <-waitingQueue:
				queue = append(queue, conn)
			}

			// match players in pairs
			for len(queue) >= 2 {
				p1 := queue[0]
				p2 := queue[1]
				queue = queue[2:]

				room := bm.CreateRoom()

				msg1 := MatchMessage{
					Type:   "matched",
					RoomID: room.ID,
					Team:   "red",
				}
				msg2 := MatchMessage{
					Type:   "matched",
					RoomID: room.ID,
					Team:   "blue",
				}

				data1, _ := json.Marshal(msg1)
				data2, _ := json.Marshal(msg2)

				if err := p1.WriteMessage(websocket.TextMessage, data1); err != nil {
					log.Println("write error:", err)
				}
				if err := p2.WriteMessage(websocket.TextMessage, data2); err != nil {
					log.Println("write error:", err)
				}

				// close matchmaking WS, client should connect to /ws/{roomID} next
				p1.Close()
				p2.Close()
			}
		}
	}()
}

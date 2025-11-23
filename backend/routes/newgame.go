package routes

import (
	"encoding/json"
	"net/http"

	"cse-110-project-team-30/backend/internal/socket"
)

type NewGameResponse struct {
	RoomID string `json:"roomID"`
}

// internal helper so tests can call it directly
func createNewGame(bm *socket.BattleManager) NewGameResponse {
	roomID := bm.CreateRoom().ID
	return NewGameResponse{RoomID: roomID}
}

func RegisterNewGameEndpoint(mux *http.ServeMux, bm *socket.BattleManager) {
	mux.HandleFunc("/newgame", func(w http.ResponseWriter, r *http.Request) {
		resp := createNewGame(bm)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})
}

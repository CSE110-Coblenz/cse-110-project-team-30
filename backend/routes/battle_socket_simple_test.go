package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"cse-110-project-team-30/backend/internal/socket"

	"github.com/gorilla/websocket"
)

func TestBattleSocketRoomCreation(t *testing.T) {
	mux := http.NewServeMux()

	// Create a real BattleManager
	bm := socket.NewBattleManager()

	// Create a room before connecting
	resp := createNewGame(bm)
	roomID := resp.RoomID

	// Register websocket route with bm
	RegisterBattleSocket(mux, bm)

	ts := httptest.NewServer(mux)
	defer ts.Close()

	// Connect first client
	ws1 := dialTestWS(ts, roomID, t)
	defer ws1.Close()

	// Connect second client
	ws2 := dialTestWS(ts, roomID, t)
	defer ws2.Close()

	// Let hub tick once
	time.Sleep(300 * time.Millisecond)

	// send a dummy message from ws1
	err := ws1.WriteMessage(websocket.TextMessage, []byte(`{"troopType":"knight","team":"red","x":1,"y":1}`))
	if err != nil {
		t.Fatalf("WriteMessage failed: %v", err)
	}

	// read from ws2 to ensure broadcast
	ws2.SetReadDeadline(time.Now().Add(500 * time.Millisecond))
	_, msg, err := ws2.ReadMessage()
	if err != nil {
		t.Fatalf("ReadMessage failed: %v", err)
	}

	if len(msg) == 0 {
		t.Fatal("Expected non-empty message from hub")
	}
}

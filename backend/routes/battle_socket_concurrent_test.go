package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"cse-110-project-team-30/backend/internal/socket"

	"github.com/gorilla/websocket"
)

func TestConcurrentBattles(t *testing.T) {
	mux := http.NewServeMux()
	bm := socket.NewBattleManager()

	// Create 3 separate battles
	roomIDs := make([]string, 3)
	for i := 0; i < 3; i++ {
		resp := createNewGame(bm)
		roomIDs[i] = resp.RoomID
	}

	// Register the websocket route
	RegisterBattleSocket(mux, bm)

	ts := httptest.NewServer(mux)
	defer ts.Close()

	type wsPair struct {
		ws1 *websocket.Conn
		ws2 *websocket.Conn
	}

	connections := make([]wsPair, 3)

	// Connect clients for each room
	for i, roomID := range roomIDs {
		ws1 := dialTestWS(ts, roomID, t)
		ws2 := dialTestWS(ts, roomID, t)
		connections[i] = wsPair{ws1, ws2}
		defer ws1.Close()
		defer ws2.Close()
	}

	// Let all hubs tick at least once
	time.Sleep(300 * time.Millisecond)

	// Send a dummy message from first client in each room
	for i, roomID := range roomIDs {
		err := connections[i].ws1.WriteMessage(websocket.TextMessage, []byte(`{"troopType":"knight","team":"red","x":1,"y":1}`))
		if err != nil {
			t.Fatalf("WriteMessage failed for room %s: %v", roomID, err)
		}
	}

	// Verify each second client receives a message independently
	for i, roomID := range roomIDs {
		connections[i].ws2.SetReadDeadline(time.Now().Add(500 * time.Millisecond))
		_, msg, err := connections[i].ws2.ReadMessage()
		if err != nil {
			t.Fatalf("ReadMessage failed for room %s: %v", roomID, err)
		}
		if len(msg) == 0 {
			t.Fatalf("Expected non-empty message for room %s", roomID)
		}
	}
}

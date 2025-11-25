package routes

import (
	"net/http/httptest"
	"testing"

	"github.com/gorilla/websocket"
)

// helper to make websocket connections
func dialTestWS(ts *httptest.Server, roomID string, t *testing.T) *websocket.Conn {
	url := "ws" + ts.URL[len("http"):] + "/ws/" + roomID
	ws, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		t.Fatalf("WebSocket dial failed: %v", err)
	}
	return ws
}

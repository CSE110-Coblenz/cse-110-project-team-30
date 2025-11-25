// handles game loop, broadcasting, and handling socket input
package socket

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"

	"cse-110-project-team-30/backend/internal/battle"
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
)

type Hub struct {
	mu      sync.Mutex
	clients map[*websocket.Conn]bool
	battle  *battle.Battle
	addCh   chan *websocket.Conn
	rmCh    chan *websocket.Conn
	stopCh  chan struct{}
}

func NewHub(b *battle.Battle) *Hub {
	return &Hub{
		clients: make(map[*websocket.Conn]bool),
		battle:  b,
		addCh:   make(chan *websocket.Conn),
		rmCh:    make(chan *websocket.Conn),
		stopCh:  make(chan struct{}),
	}
}

func (h *Hub) Run() {
	ticker := time.NewTicker(200 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// Step 1: advance the game
			h.battle.Tick()

			// Step 2: serialize arena
			payload := struct {
				Tick   int             `json:"tick"`
				Troops []troops.Entity `json:"troops"`
			}{
				Tick:   h.battle.TickCount, // or whatever your tick variable is named
				Troops: h.battle.Troops,
			}

			state, err := json.Marshal(payload)

			if err != nil {
				log.Println("error marshaling arena:", err)
				continue
			}

			// Step 3: broadcast to clients
			h.broadcast(state)

		case c := <-h.addCh:
			h.mu.Lock()
			h.clients[c] = true
			h.mu.Unlock()
			go h.handleClient(c)

		case c := <-h.rmCh:
			h.mu.Lock()
			if _, ok := h.clients[c]; ok {
				c.Close()
				delete(h.clients, c)
			}
			h.mu.Unlock()

		case <-h.stopCh:
			h.closeAll()
			return
		}
	}
}

func (h *Hub) AddClient(c *websocket.Conn) {
	h.addCh <- c
}

func (h *Hub) RemoveClient(c *websocket.Conn) {
	h.rmCh <- c
}

func (h *Hub) Stop() {
	close(h.stopCh)
}

func (h *Hub) broadcast(msg []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()

	for c := range h.clients {
		if err := c.WriteMessage(websocket.TextMessage, msg); err != nil {
			c.Close()
			delete(h.clients, c)
		}
	}
}

// --------------------
// Client reader
// --------------------
func (h *Hub) handleClient(c *websocket.Conn) {
	defer h.RemoveClient(c)

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			break
		}

		var req struct {
			TroopType string `json:"troopType"`
			Team      string `json:"team"`
			X         int    `json:"x"`
			Y         int    `json:"y"`
		}

		if err := json.Unmarshal(msg, &req); err != nil {
			log.Println("invalid client message:", err)
			continue
		}

		team := parseTeam(req.Team)
		pos := common.NewPosition(req.X, req.Y)
		_, err2 := h.battle.SpawnTroop(team, pos, req.TroopType)
		if err2 != nil {
			log.Println("spawn error:", err2)
		}
	}
}

// --------------------
// Helpers
// --------------------
func parseTeam(s string) common.Team {
	switch s {
	case "red":
		return common.TeamRed
	case "blue":
		return common.TeamBlue
	default:
		return common.TeamRed
	}
}

func (h *Hub) closeAll() {
	h.mu.Lock()
	defer h.mu.Unlock()

	for c := range h.clients {
		c.Close()
		delete(h.clients, c)
	}
}

package socket

import (
	"sync"

	"cse-110-project-team-30/backend/internal/battle"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type PlayerConn struct {
	Conn     *websocket.Conn
	UserID   string
	Username string
}
type BattleManager struct {
	mu    sync.Mutex
	rooms map[string]*Room
}

func NewBattleManager() *BattleManager {
	return &BattleManager{
		rooms: make(map[string]*Room),
	}
}

func (m *BattleManager) DeleteRoom(roomID string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	room, ok := m.rooms[roomID]
	if !ok {
		return
	}

	// Stop the hub (stops the ticker & closes connections)
	room.Hub.Stop()

	// Remove the room from manager
	delete(m.rooms, roomID)
}

func (m *BattleManager) CreateRoom() *Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	id := uuid.NewString()

	b := battle.NewBattle()

	b.OnDelete = func() {
		m.DeleteRoom(id)
	}
	h := NewHub(b)

	room := &Room{
		ID:     id,
		Battle: b,
		Hub:    h,
	}

	m.rooms[id] = room
	go h.Run()

	return room
}

func (m *BattleManager) GetRoom(id string) (*Room, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	r, ok := m.rooms[id]
	return r, ok
}

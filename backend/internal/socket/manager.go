package socket

import (
	"sync"

	"cse-110-project-team-30/backend/internal/battle"

	"github.com/google/uuid"
)

type BattleManager struct {
	mu    sync.Mutex
	rooms map[string]*Room
}

func NewBattleManager() *BattleManager {
	return &BattleManager{
		rooms: make(map[string]*Room),
	}
}

func (m *BattleManager) CreateRoom() *Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	id := uuid.NewString()

	b := battle.NewBattle()
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

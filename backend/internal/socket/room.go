package socket

import "cse-110-project-team-30/backend/internal/battle"

type Room struct {
	ID     string
	Hub    *Hub
	Battle *battle.Battle
}

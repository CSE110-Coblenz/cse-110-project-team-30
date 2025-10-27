package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
)

type Troop struct {
	ID       int
	Type     string
	Health   int
	Team     common.Team     // e.g., 0 for player, 1 for enemy
	Position common.Position // optional: x, y on the map
	Damage   int
	Speed    float64
	Range    int
}

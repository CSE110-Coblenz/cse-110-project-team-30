package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"fmt"
)

type MapView interface {
	FindNearestEnemyBFS(t *Troop) (*Troop, []common.Position)
}
type Entity interface {
	CalculateAction(mv MapView) Action
}
type Action struct {
	NextPosition common.Position // where the entity wants to move
	AttackTarget Entity          // who to attack (nil if none)
}
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

// CalculateAction for a generic troop — warns if called
func (t *Troop) CalculateAction(mv MapView) Action {
	fmt.Printf("WARNING: CalculateAction called on base Troop (ID=%d, Type=%s). You should override this method.\n", t.ID, t.Type)
	return Action{
		NextPosition: t.Position,
		AttackTarget: nil,
	}
}

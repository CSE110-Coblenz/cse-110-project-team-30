package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
)

type Castle struct {
	ID       int
	Index    int
	Team     common.Team
	Position common.Position
	Health   int
	Damage   int
	Range    int
}

// CalculateAction finds the nearest enemy in range and attacks it.
// If no enemies are in range, it just stays put.
func (c *Castle) CalculateAction(mv MapView) Action {
	target, path := mv.FindNearestEnemyBFS(c)
	if target != nil && len(path) <= c.Range {
		return Action{
			NextPosition: c.Position, // castles don’t move
			AttackTarget: target,
			Damage:       c.Damage,
		}
	}

	return Action{
		NextPosition: c.Position,
		AttackTarget: nil,
		Damage:       0,
	}
}

func (c *Castle) GetTroop() *Troop {
	return &Troop{
		ID:       c.ID,
		Type:     "Castle",
		Health:   c.Health,
		Team:     c.Team,
		Position: c.Position,
		Damage:   c.Damage,
		Speed:    0,
		Range:    c.Range,
	}
}

func (c *Castle) GetPosition() common.Position {
	return c.Position
}

func (c *Castle) GetTeam() common.Team {
	return c.Team
}

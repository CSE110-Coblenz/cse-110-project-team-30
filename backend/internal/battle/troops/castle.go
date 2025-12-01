package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/util"
)

type Castle struct {
	Troop
}

func NewCastle(id int, team common.Team, pos common.Position) Entity {
	return &Castle{
		Troop: Troop{
			ID:       id,
			Type:     "Castle",
			Team:     team,
			Position: pos,
			Health:   200,
			Damage:   1,
			Range:    10,
			Speed:    0,
		},
	}
}

func NewKingCastle(id int, team common.Team, pos common.Position) Entity {
	return &Castle{
		Troop: Troop{
			ID:       id,
			Type:     "KingTower",
			Team:     team,
			Position: pos,
			Health:   300,
			Damage:   1,
			Range:    10,
			Speed:    0,
		},
	}
}

// CalculateAction finds nearest enemy in range and attacks it
func (c *Castle) CalculateAction(mv MapView) Action {
	t := c.Troop

	// Default: do nothing
	action := Action{
		NextPosition: t.Position,
		AttackTarget: nil,
		Damage:       0,
	}

	// Find closest enemy relative to the Castle entity
	enemy, path := mv.FindNearestEnemyBFS(c)
	if enemy == nil || len(path) == 0 {
		return action
	}

	// Castles attack if the target is within range (path distance <= Range)
	if util.GetDistance(t.Position, enemy.GetPosition()) <= float64(t.Range) {
		action.AttackTarget = enemy
		action.Damage = t.Damage
	}

	return action
}

func (c *Castle) GetTroop() *Troop {
	return &c.Troop
}

func (c *Castle) GetPosition() common.Position {
	return c.Troop.Position
}

func (c *Castle) GetTeam() common.Team {
	return c.Troop.Team
}

package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
)

type Castle struct {
	troop *Troop
}

func NewCastle(id int, team common.Team, pos common.Position) *Castle {
	return &Castle{
		troop: &Troop{
			ID:       id,
			Type:     "Castle",
			Team:     team,
			Position: pos,
			Health:   200,
			Damage:   1,
			Range:    4,
			Speed:    0,
		},
	}
}

func NewKingCastle(id int, team common.Team, pos common.Position) *Castle {
	return &Castle{
		troop: &Troop{
			ID:       id,
			Type:     "KingTower",
			Team:     team,
			Position: pos,
			Health:   300,
			Damage:   2,
			Range:    5,
			Speed:    0,
		},
	}
}

// CalculateAction finds nearest enemy in range and attacks it
func (c *Castle) CalculateAction(mv MapView) Action {
	t := c.troop
	target, path := mv.FindNearestEnemyBFS(c)
	if target != nil && len(path) <= t.Range {
		return Action{
			NextPosition: t.Position, // castles don’t move
			AttackTarget: target,
			Damage:       t.Damage,
		}
	}

	return Action{
		NextPosition: t.Position,
		AttackTarget: nil,
		Damage:       0,
	}
}

func (c *Castle) GetTroop() *Troop {
	return c.troop
}

func (c *Castle) GetPosition() common.Position {
	return c.troop.Position
}

func (c *Castle) GetTeam() common.Team {
	return c.troop.Team
}

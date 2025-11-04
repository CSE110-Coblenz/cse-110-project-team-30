package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/util"
)

type Knight struct {
	Troop
}

func NewKnight(team common.Team, pos common.Position) *Knight {
	return &Knight{
		Troop: Troop{
			Type:     "Knight",
			Health:   250,
			Damage:   50,
			Speed:    1.0,
			Range:    1,
			Position: pos,
			Team:     team,
		},
	}
}

func (k *Knight) CalculateAction(mv MapView) Action {
	// Default action: do nothing
	action := Action{
		NextPosition: k.Position,
		AttackTarget: nil,
	}

	// Find nearest enemy using BFS
	enemy, path := mv.FindNearestEnemyBFS(&k.Troop) // assuming k has a reference to the map
	if enemy == nil || len(path) == 0 {
		return action
	}

	// If enemy is in range (adjacent), attack
	if len(path) == 1 || util.GetDistance(k.Position, enemy.Position) <= float64(k.Range) {
		action.AttackTarget = enemy
		return action
	}

	// Otherwise, move one step along the path toward enemy
	action.NextPosition = path[1] // path[0] is current position
	return action
}

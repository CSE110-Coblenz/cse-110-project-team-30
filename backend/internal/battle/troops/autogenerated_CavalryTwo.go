package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/util"
)

type CavalryTwo struct {
	Troop
}

func NewCavalryTwo(team common.Team, pos common.Position) Entity {
	return &CavalryTwo{
		Troop: Troop{
			Type:     "CavalryTwo",
			Health:   16,
			Damage:   5,
			Speed:    1,
			Range:    1,
			Position: pos,
			Team:     team,
		},
	}
}

func (t *CavalryTwo) CalculateAction(mv MapView) Action {
	action := Action{
		NextPosition: t.Position,
		AttackTarget: nil,
		Damage:       0,
	}

	enemy, path := mv.FindNearestEnemyBFS(t)
	if enemy == nil || len(path) == 0 {
		return action
	}

	if len(path) == 1 || util.GetDistance(t.Position, enemy.GetPosition()) <= float64(t.Range) {
		action.AttackTarget = enemy
		action.Damage = t.Damage
		return action
	}

	if len(path) > 1 {
		action.NextPosition = path[1]
	}
	return action
}

package troops

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/util"
)

type SpearmanFour struct {
	Troop
}

func NewSpearmanFour(team common.Team, pos common.Position) Entity {
	return &SpearmanFour{
		Troop: Troop{
			Type:     "SpearmanFour",
			Health:   40,
			Damage:   6,
			Speed:    1,
			Range:    2,
			Position: pos,
			Team:     team,
		},
	}
}

func (t *SpearmanFour) CalculateAction(mv MapView) Action {
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

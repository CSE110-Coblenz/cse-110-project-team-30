package troops

import "cse-110-project-team-30/backend/internal/battle/common"

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

package battle

import (
	"cse-110-project-team-30/backend/internal/battle/arena"
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
	"errors"
)

type Battle struct {
	Arena  *arena.Map
	Troops []*troops.Troop
}

func NewBattle() *Battle {
	b := &Battle{
		Arena:  arena.NewMap(10, 20), // instantiate here
		Troops: []*troops.Troop{},
	}
	return b
}
func (b *Battle) SpawnTroop(team common.Team, pos common.Position) (*troops.Troop, error) {
	if !b.Arena.InBounds(pos) {
		return nil, errors.New("position out of arena bounds")
	}
	newTroop := troops.NewKnight(team, pos)
	b.Arena.AddTroop(int(pos.X), int(pos.Y), &newTroop.Troop)
	return &newTroop.Troop, nil
}

func (b *Battle) PrintArena() string {
	return b.Arena.String()
}

package battle

import (
	"cse-110-project-team-30/backend/internal/battle/arena"
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
	"errors"
	"math"
)

type Battle struct {
	Arena  *arena.Map
	Troops []troops.Entity
}

func NewBattle() *Battle {
	b := &Battle{
		Arena:  arena.NewMap(10, 20), // instantiate here
		Troops: []troops.Entity{},
	}
	return b
}
func (b *Battle) SpawnTroop(team common.Team, pos common.Position) (*troops.Troop, error) {
	if !b.Arena.InBounds(pos) {
		return nil, errors.New("position out of arena bounds")
	}
	newTroop := troops.NewKnight(team, pos)
	b.Arena.AddTroop(int(pos.X), int(pos.Y), &newTroop.Troop)
	b.Troops = append(b.Troops, newTroop)
	return &newTroop.Troop, nil
}

func (b *Battle) PrintArena() string {
	return b.Arena.String()
}

func (b *Battle) PrintArenaWithMarkers(markers []common.Position) string {
	return b.Arena.StringWithMarkers(markers)
}
func (b *Battle) Tick() {
	actions := b.calculateActions()
	b.applyMovement(actions)
	b.applyAttacks(actions)
}

// ------------------------
// Step 1: Calculate actions
// ------------------------
func (b *Battle) calculateActions() map[troops.Entity]troops.Action {
	actions := make(map[troops.Entity]troops.Action)
	for _, t := range b.Troops {
		action := t.CalculateAction(b.Arena)
		actions[t] = action
	}
	return actions
}

// ------------------------
// Step 2: Apply movement
// ------------------------
func (b *Battle) applyMovement(actions map[troops.Entity]troops.Action) {
	for troop, action := range actions {
		oldX, oldY := int(math.Round(troop.GetTroop().Position.X)), int(math.Round(troop.GetTroop().Position.Y))
		newX, newY := int(math.Round(action.NextPosition.X)), int(math.Round(action.NextPosition.Y))

		if !b.Arena.InBounds(common.NewPosition(newX, newY)) {
			continue
		}

		b.removeTroopFromTile(troop.GetTroop(), oldX, oldY)
		b.Arena.AddTroop(newX, newY, troop.GetTroop())
		troop.GetTroop().Position = common.NewPosition(newX, newY)
	}
}

// ------------------------
// Step 3: Apply attacks
// ------------------------
func (b *Battle) applyAttacks(actions map[troops.Entity]troops.Action) {
	for _, action := range actions {
		if action.AttackTarget != nil {
			target := action.AttackTarget.GetTroop()
			target.Health -= action.Damage
			if target.Health <= 0 {
				x, y := int(math.Round(target.Position.X)), int(math.Round(target.Position.Y))
				b.removeTroopFromTile(target, x, y)
				b.removeTroopFromBattle(target)
			}
		}
	}
}

// ------------------------
// Helper: remove troop from a tile
// ------------------------
func (b *Battle) removeTroopFromTile(t *troops.Troop, x, y int) {
	tile := b.Arena.Tiles[y][x]
	for i, tt := range tile.Troops {
		if tt == t {
			tile.Troops = append(tile.Troops[:i], tile.Troops[i+1:]...)
			break
		}
	}
}

// ------------------------
// Helper: remove troop from battle slice
// ------------------------
func (b *Battle) removeTroopFromBattle(t *troops.Troop) {
	for i, tt := range b.Troops {
		if tt == t {
			b.Troops = append(b.Troops[:i], b.Troops[i+1:]...)
			break
		}
	}
}

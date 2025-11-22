package battle

import (
	"cse-110-project-team-30/backend/internal/battle/arena"
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
	"errors"
	"math"
	"time"
)

const MaxTicks = 10000

type Battle struct {
	TickCount   int
	Arena       *arena.Map
	Troops      []troops.Entity
	TowerStatus map[common.Team][]bool
	Enabled     bool
	OnDelete    func()
}

func NewBattle() *Battle {
	b := &Battle{
		TickCount:   0,
		Arena:       arena.NewMap(16, 16), // instantiate here
		Troops:      []troops.Entity{},
		TowerStatus: make(map[common.Team][]bool),
	}
	// Spawn castles for team 0 (e.g., player)

	b.TowerStatus = map[common.Team][]bool{
		0: {false, false, false},
		1: {false, false, false},
	}
	b.Enabled = true
	// Spawn castles for team 1 (e.g., enemy)
	b.spawnTeamCastles(0)
	b.spawnTeamCastles(1)
	return b
}

func (b *Battle) spawnTeamCastles(team common.Team) {
	numCastles := 3 // total castles per team
	mapWidth := b.Arena.Width
	mapHeight := b.Arena.Height

	var yFront int
	var yKingOffset int
	kingIndex := numCastles / 2 // middle castle

	if team == 0 {
		yFront = 3
		yKingOffset = -1 // king tower one tile behind
	} else {
		yFront = mapWidth - 4
		yKingOffset = 1
	}

	for i := 0; i < numCastles; i++ {
		x := (mapHeight / 4) * (i + 1)
		y := yFront
		isKing := i == kingIndex

		if isKing {
			y += yKingOffset
		}

		b.TowerStatus[team][i] = true
		pos := common.NewPosition(x, y)
		var castle troops.Entity
		if isKing {
			castle = troops.NewKingCastle(-(i + int(team)*10), team, pos)
		} else {
			castle = troops.NewCastle(-(i + int(team)*10), team, pos)
		}
		b.Arena.AddTroop(int(pos.X), int(pos.Y), castle.GetTroop())
		b.Troops = append(b.Troops, castle)
	}
}

func (b *Battle) SpawnTroop(team common.Team, pos common.Position, troopType string) (*troops.Troop, error) {
	if !b.Arena.InBounds(pos) {
		return nil, errors.New("position out of arena bounds")
	}
	newTroop := troops.NewTroopByType(troopType, team, pos)
	b.Arena.AddTroop(int(pos.X), int(pos.Y), newTroop.GetTroop())
	b.Troops = append(b.Troops, newTroop)
	return newTroop.GetTroop(), nil
}

func (b *Battle) PrintArena() string {
	return b.Arena.String()
}

func (b *Battle) PrintArenaWithMarkers(markers []common.Position) string {
	return b.Arena.StringWithMarkers(markers)
}

func (b *Battle) Tick() {
	b.TickCount++
	if !b.Enabled {
		return
	}
	actions := b.calculateActions()
	b.applyMovement(actions)
	b.applyAttacks(actions)
	b.removeDeadTroops()
	if b.TickCount >= MaxTicks {
		b.EndGame()
	}
}

func (b *Battle) EndGame() {
	if !b.Enabled {
		return
	}
	b.Enabled = false
	go func() {
		time.Sleep(1000 * time.Millisecond)
		if b.OnDelete != nil {
			b.OnDelete()
		}
	}()
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
		}
	}
}

// ------------------------
// Helper: remove troop from a tile
// ------------------------
func (b *Battle) removeTroopFromTile(t *troops.Troop, x, y int) {
	tile := b.Arena.Tiles[y][x]
	for i, e := range tile.Troops {
		tt := e.GetTroop()
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
	for i, e := range b.Troops {
		tt := e.GetTroop()
		if tt == t {
			b.Troops = append(b.Troops[:i], b.Troops[i+1:]...)
			break
		}
	}
}

// Step 4: remove dead troops

func (b *Battle) removeDeadTroops() {
	alive := b.Troops[:0]
	for _, e := range b.Troops {
		t := e.GetTroop()
		if t.Health <= 0 && t.Type == "Castle" {
			b.TowerStatus[t.Team][t.ID%10] = false
			if t.ID%10 == 1 { // king tower
				b.EndGame()
			}
		}
		if t.Health > 0 {
			alive = append(alive, e)
		} else {
			x, y := int(math.Round(t.Position.X)), int(math.Round(t.Position.Y))
			b.removeTroopFromTile(t, x, y)
			b.removeTroopFromBattle(t)
		}
	}
	b.Troops = alive
}

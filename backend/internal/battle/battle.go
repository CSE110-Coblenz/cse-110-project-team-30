package battle

import (
	"cse-110-project-team-30/backend/internal/battle/arena"
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
	"errors"
	"fmt"
	"math"
	"time"
)

const MaxTicks = 10000

type Battle struct {
	TickCount   int
	IDMgr       int
	Arena       *arena.Map
	Troops      []troops.Entity
	TowerStatus map[common.Team][]bool
	Enabled     bool
	OnDelete    func()
}

func NewBattle() *Battle {
	b := &Battle{
		TickCount:   0,
		IDMgr:       1,
		Arena:       arena.NewMap(32, 32), // instantiate here
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
		yFront = 6
		yKingOffset = -2 // king tower one tile behind
	} else {
		yFront = mapWidth - 7
		yKingOffset = 2
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
			castle = troops.NewKingCastle(-(i + 1 + int(team)*10), team, pos)
		} else {
			castle = troops.NewCastle(-(i + 1 + int(team)*10), team, pos)
		}
		b.Arena.AddTroop(int(pos.X), int(pos.Y), castle.GetTroop())
		b.Troops = append(b.Troops, castle)
	}
}

func (b *Battle) SpawnTroop(team common.Team, pos common.Position, troopType string) (*troops.Troop, error) {
	if !b.Enabled {
		return nil, errors.New("battle is over")
	}
	if !b.Arena.InBounds(pos) {
		return nil, errors.New("position out of arena bounds")
	}
	if (team == common.Team(1) && pos.Y < float64(b.Arena.Height)/2) || (team == common.Team(0) && pos.Y >= float64(b.Arena.Height)/2) {
		return nil, errors.New("cannot spawn troop in enemy territory")
	}
	newTroop := troops.NewTroopByType(troopType, team, pos)
	if newTroop == nil || newTroop.GetTroop() == nil {
		return nil, fmt.Errorf("failed to create troop of type %s", troopType)
	}
	b.IDMgr++
	newTroop.GetTroop().ID = b.IDMgr
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
		time.Sleep(5000 * time.Millisecond)
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
	alive := make([]troops.Entity, 0, len(b.Troops))
	for _, e := range b.Troops {
		t := e.GetTroop()
		if t.Health <= 0 {
			x, y := int(math.Round(t.Position.X)), int(math.Round(t.Position.Y))
			if b.Arena.InBounds(common.NewPosition(x, y)) {
				b.removeTroopFromTile(t, x, y)
			}
			if t.Type == "Castle" || t.Type == "KingTower" {
				idx := ((-t.ID) % 10) - 1
				if idx >= 0 && idx < len(b.TowerStatus[t.Team]) {
					b.TowerStatus[t.Team][idx] = false
				}
			}
			if t.Type == "KingTower" {
				if ((-t.ID) % 10) == 2 {
					println("King tower destroyed for team", t.Team)
					//destroy all towers for that team
					for i := range b.TowerStatus[t.Team] {
						b.TowerStatus[t.Team][i] = false
					}
					b.EndGame()
				}
			}
			continue
		}
		alive = append(alive, e)
	}
	b.Troops = alive
}

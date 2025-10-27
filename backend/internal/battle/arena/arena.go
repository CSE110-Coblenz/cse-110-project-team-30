package arena

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
	"cse-110-project-team-30/backend/internal/util"
	"fmt"
	"strings"
)

type Tile struct {
	Troops []*troops.Troop
}

type Map struct {
	Width, Height int
	Tiles         [][]*Tile
}

func NewMap(width, height int) *Map {
	tiles := make([][]*Tile, height)
	for y := range tiles {
		tiles[y] = make([]*Tile, width)
		for x := range tiles[y] {
			tiles[y][x] = &Tile{
				Troops: []*troops.Troop{}, // Tiles are empty to start
			}
		}
	}
	return &Map{
		Width:  width,
		Height: height,
		Tiles:  tiles,
	}
}

func (m *Map) AddTroop(x, y int, t *troops.Troop) {
	if x < 0 || x >= m.Width || y < 0 || y >= m.Height {
		return // or panic/error
	}
	m.Tiles[y][x].Troops = append(m.Tiles[y][x].Troops, t)
}

func (m *Map) String() string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("Map (%dx%d):\n", m.Width, m.Height))
	for y := 0; y < m.Height; y++ {
		for x := 0; x < m.Width; x++ {
			tile := m.Tiles[y][x]
			troopCount := len(tile.Troops)
			sb.WriteString(fmt.Sprintf("[%d]", troopCount))
		}
		sb.WriteString("\n")
	}
	return sb.String()
}

// FindNearestEnemy returns the nearest enemy troop to the given troop
// tX, tY are the coordinates of the source troop
func (m *Map) FindNearestEnemy(t *troops.Troop) (*troops.Troop, int, int) {
	var nearest *troops.Troop
	var nearestX, nearestY int
	tX := int(t.Position.X)
	tY := int(t.Position.Y)
	// Use max possible map distance as initial "minDist"
	minDist := util.GetDistance(
		common.NewPosition(0, 0),
		common.NewPosition(m.Width-1, m.Height-1),
	)

	for y := 0; y < m.Height; y++ {
		for x := 0; x < m.Width; x++ {
			for _, other := range m.Tiles[y][x].Troops {
				if other.Team == t.Team {
					continue // skip allies
				}
				d := util.GetDistance(
					common.NewPosition(tX, tY),
					common.NewPosition(x, y),
				)
				if d < minDist {
					minDist = d
					nearest = other
					nearestX = x
					nearestY = y
				}
			}
		}
	}

	return nearest, nearestX, nearestY
}

// InBounds returns true if the given position is inside the map
func (m *Map) InBounds(pos common.Position) bool {
	x := int(pos.X)
	y := int(pos.Y)

	if x < 0 {
		return false
	}
	if x >= m.Width {
		return false
	}
	if y < 0 {
		return false
	}
	if y >= m.Height {
		return false
	}

	return true
}

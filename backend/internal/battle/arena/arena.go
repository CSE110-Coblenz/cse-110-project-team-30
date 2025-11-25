package arena

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"cse-110-project-team-30/backend/internal/battle/troops"
	"fmt"
	"strings"
)

type Tile struct {
	Troops []troops.Entity
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
				Troops: []troops.Entity{}, // Tiles are empty to start
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

func (m *Map) StringWithMarkers(markers []common.Position) string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("Map (%dx%d):\n", m.Width, m.Height))

	// Build a quick lookup for marker positions
	markerMap := make(map[[2]int]bool)
	for _, pos := range markers {
		x, y := int(pos.X), int(pos.Y)
		if x >= 0 && x < m.Width && y >= 0 && y < m.Height {
			markerMap[[2]int{x, y}] = true
		}
	}

	for y := 0; y < m.Height; y++ {
		for x := 0; x < m.Width; x++ {
			tile := m.Tiles[y][x]
			troopCount := len(tile.Troops)
			if markerMap[[2]int{x, y}] {
				sb.WriteString(fmt.Sprintf("[%d']", troopCount))
			} else {
				sb.WriteString(fmt.Sprintf("[%d ]", troopCount))
			}
		}
		sb.WriteString("\n")
	}
	return sb.String()
}

// FindNearestEnemyBFS finds the nearest enemy troop using BFS
// and returns both the troop and the path (list of positions).
func (m *Map) FindNearestEnemyBFS(t troops.Entity) (troops.Entity, []common.Position) {
	start := common.NewPosition(int(t.GetPosition().X), int(t.GetPosition().Y))

	type Node struct {
		pos  common.Position
		path []common.Position
	}

	queue := []Node{{pos: start, path: []common.Position{start}}}
	visited := make(map[common.Position]bool)
	visited[start] = true

	directions := []common.Position{
		common.NewPosition(1, 0),   // right
		common.NewPosition(-1, 0),  // left
		common.NewPosition(0, 1),   // down
		common.NewPosition(0, -1),  // up
		common.NewPosition(1, 1),   // down-right
		common.NewPosition(1, -1),  // up-right
		common.NewPosition(-1, 1),  // down-left
		common.NewPosition(-1, -1), // up-left
	}

	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]

		x, y := int(current.pos.X), int(current.pos.Y)

		// Check for enemies on this tile
		for _, other := range m.Tiles[y][x].Troops {
			if other.GetTeam() != t.GetTeam() {
				// Found the nearest enemy — return both troop and path
				return other, current.path
			}
		}

		// Enqueue neighbors
		for _, dir := range directions {
			next := common.NewPosition(x+int(dir.X), y+int(dir.Y))
			if !m.InBounds(next) || visited[next] {
				continue
			}
			visited[next] = true

			// Copy path so each node has its own
			newPath := append([]common.Position{}, current.path...)
			newPath = append(newPath, next)
			queue = append(queue, Node{pos: next, path: newPath})
		}
	}

	// No enemies found
	return nil, nil
}

// InBounds returns true if the given position is inside the map
func (m *Map) InBounds(pos common.Position) bool {
	x := int(pos.X)
	y := int(pos.Y)

	return x >= 0 && x < m.Width && y >= 0 && y < m.Height
}

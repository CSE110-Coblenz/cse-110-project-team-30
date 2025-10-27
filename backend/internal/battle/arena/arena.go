package arena

type Tile struct {
    Troops []*Troop
}

type Map struct {
    Width, Height int
    Tiles         [][]*Tile
	TroopCounter  int			//Total number of troops that have spawned
}

func NewMap(width, height int) *Map {
    tiles := make([][]*Tile, height)
    for y := range tiles {
        tiles[y] = make([]*Tile, width)
        for x := range tiles[y] {
            tiles[y][x] = &Tile{
                Troops: []*Troop{}, // Tiles are empty to start
            }
        }
    }
    return &Map{
        Width:  width,
        Height: height,
        Tiles:  tiles,
		TroopCounter: 0,
    }
}

func (m *Map) AddTroop(x, y int, t *Troop) {
    if x < 0 || x >= m.Width || y < 0 || y >= m.Height {
        return // or panic/error
    }
    m.Tiles[y][x].Troops = append(m.Tiles[y][x].Troops, t)
}
package troops

type Troop struct {
    ID       int
    Type     string
    Health   int
	Team	 Team    // e.g., 0 for player, 1 for enemy
    Position [2]int // optional: x, y on the map
}

func FindNearestEnemy(startX, startY int, arena *Arena, allyTeam int) *Troop {
    visited := make(map[[2]int]bool)
    queue := [][2]int{{startX, startY}}

    dirs := [][2]int{
        {0, 1}, {1, 0}, {0, -1}, {-1, 0}, // 4-way
    }

    for len(queue) > 0 {
        x, y := queue[0][0], queue[0][1]
        queue = queue[1:]

        visited[[2]int{x, y}] = true

        tile := arena.Tiles[y][x]
        for _, t := range tile.Troops {
            if t.Team != allyTeam {
                return t // found nearest enemy
            }
        }

        for _, d := range dirs {
            nx, ny := x+d[0], y+d[1]
            if nx < 0 || nx >= arena.Width || ny < 0 || ny >= arena.Height {
                continue
            }
            if !visited[[2]int{nx, ny}] {
                queue = append(queue, [2]int{nx, ny})
            }
        }
    }

    return nil // no enemies found
}
package common

type Position struct {
	X, Y float64
}

func NewPosition(x, y int) Position {
	return Position{
		X: float64(x),
		Y: float64(y),
	}
}

type Team int

const (
	TeamRed Team = iota
	TeamBlue
)

package util

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"math"
)

// GetDistance returns the Euclidean distance between two points.
func GetDistance(a, b common.Position) float64 {
	dx := b.X - a.X
	dy := b.Y - a.Y
	return math.Hypot(dx, dy) // sqrt(dx*dx + dy*dy)
}

package util

import "math"

type Vec2 struct {
	X, Y float64
}

// GetDistance returns the Euclidean distance between two points.
func GetDistance(a, b Vec2) float64 {
	dx := b.X - a.X
	dy := b.Y - a.Y
	return math.Hypot(dx, dy) // sqrt(dx*dx + dy*dy)
}
package util

import (
    "testing"
)

func TestGetDistance(t *testing.T) {
    a := Vec2{0, 0}
    b := Vec2{3, 4}
    dist := GetDistance(a, b)
    if dist != 5 {
        t.Errorf("Expected 5, got %v", dist)
    }
}
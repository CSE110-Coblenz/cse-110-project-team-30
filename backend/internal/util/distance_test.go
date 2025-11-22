package util

import (
	"cse-110-project-team-30/backend/internal/battle/common"
	"testing"
)

func TestGetDistance(t *testing.T) {
	a := common.NewPosition(0, 0)
	b := common.NewPosition(3, 4)
	dist := GetDistance(a, b)
	if dist != 5 {
		t.Errorf("Expected 5, got %v", dist)
	}
}

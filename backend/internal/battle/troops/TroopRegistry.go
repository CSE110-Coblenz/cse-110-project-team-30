package troops

import "cse-110-project-team-30/backend/internal/battle/common"

// TroopRegistry maps string keys to constructor functions.
var TroopRegistry = map[string]func(team common.Team, pos common.Position) Entity{
	"SpearmanFour": NewSpearmanFour,
	"SwordsmanTwo": NewSwordsmanTwo,
	"SwordsmanThree": NewSwordsmanThree,
	"SwordsmanFour": NewSwordsmanFour,
	"ArcherTwo": NewArcherTwo,
	"CavalryOne": NewCavalryOne,
	"CavalryTwo": NewCavalryTwo,
	"CavalryThree": NewCavalryThree,
	"ArcherThree": NewArcherThree,
	"SpearmanThree": NewSpearmanThree,
	"SwordsmanOne": NewSwordsmanOne,
	"ArcherOne": NewArcherOne,
	"CavalryFour": NewCavalryFour,
	"ArcherFour": NewArcherFour,
	"SpearmanOne": NewSpearmanOne,
	"SpearmanTwo": NewSpearmanTwo,
}

// NewTroopByType creates a new troop by its type string.
func NewTroopByType(troopType string, team common.Team, pos common.Position) Entity {
	if constructor, ok := TroopRegistry[troopType]; ok {
		return constructor(team, pos)
	}
	return nil
}

// AvailableTroopTypes returns all keys in the registry
func AvailableTroopTypes() []string {
	keys := make([]string, 0, len(TroopRegistry))
	for k := range TroopRegistry {
		keys = append(keys, k)
	}
	return keys
}

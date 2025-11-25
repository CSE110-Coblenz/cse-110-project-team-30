Generates troops as a struct with constructor

Also creates a TroopRegistry.go file that maps troop name strings to constructor functions

Run using:
`go run generate_troops_from_json.go -o ../../internal/battle/troops ./troops.json`

-o flag sets output directory

pass in json file as argument

Example Troops.json input:
``json
{
  "SwordsmanOne": { "operation": "Addition", "hp": 10, "damage": 4, "level": 1, "Type": "Swordsman", "Speed": 1.0, "Range": 1 },
  "SwordsmanTwo": { "operation": "Addition", "hp": 12, "damage": 4, "level": 2, "Type": "Swordsman", "Speed": 1.0, "Range": 1 },
  "SwordsmanThree": { "operation": "Addition", "hp": 14, "damage": 5, "level": 3, "Type": "Swordsman", "Speed": 1.0, "Range": 1 },
  "SwordsmanFour": { "operation": "Addition", "hp": 16, "damage": 5, "level": 4, "Type": "Swordsman", "Speed": 1.0, "Range": 1 },

  "ArcherOne": { "operation": "Subtraction", "hp": 10, "damage": 4, "level": 1, "Type": "Archer", "Speed": 1.2, "Range": 7 },
  "ArcherTwo": { "operation": "Subtraction", "hp": 12, "damage": 4, "level": 2, "Type": "Archer", "Speed": 1.2, "Range": 7 },
  "ArcherThree": { "operation": "Subtraction", "hp": 14, "damage": 5, "level": 3, "Type": "Archer", "Speed": 1.2, "Range": 7 },
  "ArcherFour": { "operation": "Subtraction", "hp": 16, "damage": 5, "level": 4, "Type": "Archer", "Speed": 1.2, "Range": 7 },

  "SpearmanOne": { "operation": "Multiplication", "hp": 14, "damage": 5, "level": 1, "Type": "Spearman", "Speed": 1.0, "Range": 2 },
  "SpearmanTwo": { "operation": "Multiplication", "hp": 16, "damage": 5, "level": 2, "Type": "Spearman", "Speed": 1.0, "Range": 2 },
  "SpearmanThree": { "operation": "Multiplication", "hp": 18, "damage": 6, "level": 3, "Type": "Spearman", "Speed": 1.0, "Range": 2 },
  "SpearmanFour": { "operation": "Multiplication", "hp": 20, "damage": 6, "level": 4, "Type": "Spearman", "Speed": 1.0, "Range": 2 },

  "CavalryOne": { "operation": "Division", "hp": 14, "damage": 10, "level": 1, "Type": "Cavalry", "Speed": 1.5, "Range": 1 },
  "CavalryTwo": { "operation": "Division", "hp": 16, "damage": 11, "level": 2, "Type": "Cavalry", "Speed": 1.5, "Range": 1 },
  "CavalryThree": { "operation": "Division", "hp": 18, "damage": 12, "level": 3, "Type": "Cavalry", "Speed": 1.5, "Range": 1 },
  "CavalryFour": { "operation": "Division", "hp": 20, "damage": 12, "level": 4, "Type": "Cavalry", "Speed": 1.5, "Range": 1 }
}
```

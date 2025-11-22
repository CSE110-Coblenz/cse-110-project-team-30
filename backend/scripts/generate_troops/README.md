Generates troops as a struct with constructor

Also creates a TroopRegistry.go file that maps troop name strings to constructor functions

Run using:
`go run generate_troops_from_json.go -o ../../internal/battle/troops ./troops.json`

-o flag sets output directory

pass in json file as argument
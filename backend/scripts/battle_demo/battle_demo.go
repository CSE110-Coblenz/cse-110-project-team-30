package main

import (
	"fmt"
	"log"
	"time"

	"cse-110-project-team-30/backend/internal/battle"
	"cse-110-project-team-30/backend/internal/battle/common"
)

func main() {
	// Create a new battle
	b := battle.NewBattle()

	// Spawn some troops
	t1, err := b.SpawnTroop(common.Team(0), common.NewPosition(2, 3), "knight")
	if err != nil {
		log.Fatal(err)
	}

	t2, err := b.SpawnTroop(common.Team(1), common.NewPosition(7, 7), "knight")
	if err != nil {
		log.Fatal(err)
	}

	t3, err := b.SpawnTroop(common.Team(1), common.NewPosition(5, 5), "knight")
	if err != nil {
		log.Fatal(err)
	}

	// Print the arena to see troop placements
	fmt.Println("Initial Arena:")

	fmt.Println(b.PrintArena())
	// Find the nearest enemy for t1
	enemy, path := b.Arena.FindNearestEnemyBFS(t1)
	if enemy != nil {
		fmt.Printf("\nNearest enemy to Troop 1 (%s at %.1f, %.1f):\n", t1.Type, t1.Position.X, t1.Position.Y)
		fmt.Printf("Enemy: %s at (%.1f, %.1f)\n", enemy.GetTroop().Type, enemy.GetTroop().Position.X, enemy.GetTroop().Position.Y)

		fmt.Print("Path to enemy: ")
		fmt.Println(b.PrintArenaWithMarkers(path))
		fmt.Println()
	} else {
		fmt.Println("No enemies found for Troop 1")
	}
	// Print some info about spawned troops
	fmt.Printf("Troop 1: %s at (%.1f, %.1f)\n", t1.Type, t1.Position.X, t1.Position.Y)
	fmt.Printf("Troop 2: %s at (%.1f, %.1f)\n", t2.Type, t2.Position.X, t2.Position.Y)
	fmt.Printf("Troop 3: %s at (%.1f, %.1f)\n", t3.Type, t3.Position.X, t3.Position.Y)
	for i := 1; i <= 5; i++ {
		fmt.Printf("\n--- Tick %d ---\n", i)
		b.Tick() // This calls CalculateAction and applyMovement internally
		fmt.Println(b.PrintArena())
		time.Sleep(500 * time.Millisecond)
	}
	fmt.Printf("\nFinal Troop Positions after 5 ticks:\n")
	fmt.Printf("Troop 1: %s at (%.1f, %.1f)\n", t1.Type, t1.Position.X, t1.Position.Y)
	fmt.Printf("Troop 2: %s at (%.1f, %.1f)\n", t2.Type, t2.Position.X, t2.Position.Y)
	fmt.Printf("Troop 3: %s at (%.1f, %.1f)\n", t3.Type, t3.Position.X, t3.Position.Y)

}

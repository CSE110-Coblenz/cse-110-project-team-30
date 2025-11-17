package main

import (
	"cse-110-project-team-30/backend/internal/battle"
	"cse-110-project-team-30/backend/internal/socket"
	"cse-110-project-team-30/backend/routes"
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	routes.RegisterHelloWorld(mux)

	b := battle.NewBattle()
	hub := socket.NewHub(b)
	go hub.Run() // goroutine
	routes.RegisterBattleSocket(mux, hub)
	http.ListenAndServe(":8080", mux)
	fmt.Print("Starting server on :8080\n")
}

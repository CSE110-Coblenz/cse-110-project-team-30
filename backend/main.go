package main

import (
	"net/http"
	"cse-110-project-team-30/backend/routes"
)

func main() {
	mux := http.NewServeMux()
	routes.RegisterHelloWorld(mux)
	http.ListenAndServe(":8080", mux)
}
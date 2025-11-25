package main

import (
	"cse-110-project-team-30/backend/internal/socket"
	"cse-110-project-team-30/backend/routes"
	"fmt"
	"net/http"
)

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	routes.RegisterHelloWorld(mux)

	mgr := socket.NewBattleManager()
	routes.RegisterBattleSocket(mux, mgr)
	routes.RegisterNewGameWS(mux, mgr)
	fmt.Print("Starting server on :8080\n")
	http.ListenAndServe(":8080", withCORS(mux))
}

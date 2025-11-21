# Backend (battle) — README

This package contains the backend game simulation and a small HTTP/WebSocket server used by the project.

Contents
- `main.go` — program entry. Instantiates a `battle.Battle`, a `socket.Hub`, registers HTTP routes and starts the server on `:8080`.
- `internal/battle` — core game logic (Battle, Arena, Troops).
- `internal/socket` — WebSocket hub that broadcasts battle state to connected clients.
- `routes` — HTTP route registrations (hello endpoint and WebSocket `/ws`).

Quick start

1. Build and run:

   go run ./main.go

2. Endpoints
- `GET /hello` — responds with `Hello World!`.
- GET /ws/<roomID> — WebSocket upgrade endpoint for a specific battle room.  
The first client to connect to a given <roomID> will create a new battle. Subsequent clients join the same battle room.

Example:

const ws = new WebSocket("ws://localhost:8080/ws/room123");


e.g.
`const ws = new WebSocket("ws://localhost:8080/ws");`

Key types and behavior

Battle
- `type Battle` — top-level simulation containing:
  - `TickCount int` — number of ticks processed.
  - `Arena *arena.Map` — the map containing tiles and troops.
  - `Troops []troops.Entity` — list of entities participating in the battle.

- `NewBattle()` — creates a 16x16 `arena.Map` and empty troop list.
- `SpawnTroop(team common.Team, pos common.Position, troopType string)` — spawns a troop of the provided type (e.g. `"knight"`) at the requested position and registers it on the arena and battle.
- `Tick()` — advances the simulation one tick. The tick runs the following substeps:
  1. `calculateActions()` — queries each troop for its intended `Action`.
  2. `applyMovement(actions)` — moves troops to their `NextPosition` (if in bounds) and updates arena tiles.
  3. `applyAttacks(actions)` — applies damage to attack targets.
  4. `removeDeadTroops()` — clears troops with `Health <= 0` from the arena and top-level list.

Arena (`internal/battle/arena`)
- `type Map` — manages `Tiles` which contain small lists of troops.
- `NewMap(width, height)` — creates a new grid of `Tile` pointers.
- `AddTroop(x,y,t *troops.Troop)` — appends a troop to the given tile.
- `FindNearestEnemyBFS(t troops.Entity)` — BFS search that returns the nearest enemy `Entity` and the path as a slice of `common.Position`.
- `String()` / `StringWithMarkers(markers []common.Position)` — helpers for text visualization / debugging.

Troops (`internal/battle/troops`)
- `Entity` interface exposes: `CalculateAction(MapView) Action`, `GetTroop() *Troop`, `GetPosition()`, `GetTeam()`.
- `Troop` struct — base data: `ID, Type, Health, Team, Position, Damage, Speed, Range`.
- `Knight` — concrete implementation that searches for the nearest enemy using the map view, moves toward it, and attacks when in range.

Socket
- The WebSocket `Hub` (in `internal/socket`) runs in its own goroutine and accepts client connections. When a client connects to `/ws`, the connection is registered and will receive messages according to the Hub's implementation (see `internal/socket` for exact message shapes and broadcast logic).

Notes, caveats, and extension points
- Default map size is 16x16 and currently hard-coded in `NewBattle()`.
- `SpawnTroop` uses a simple registry for troop constructors; new troop types can be added by adding a constructor function to that map.
- `Troop.CalculateAction` is implemented per-type; the base `Troop` method prints a warning if invoked directly.
- No persistence: battles and entities are in-memory only.
- The server in `main.go` listens on `:8080` unconditionally; consider using an env var for the port in production.

Testing / experimentation
- The `scripts` folder includes `battle_demo.go` for local, quick demos.
- Unit tests can be added under each package; `util/distance_test.go` is an example of existing test scaffolding.

Where to look next
- `internal/battle/battle.go` — core tick implementation and troop lifecycle management.
- `internal/battle/arena/arena.go` — BFS pathing and tile management.
- `internal/socket` — hub and message broadcast logic.

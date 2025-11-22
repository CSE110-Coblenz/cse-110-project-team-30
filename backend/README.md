# Backend WebSocket & Battle Module Documentation
 
 This document covers the updated backend design, including room-based battles, WebSocket hubs, and troop management.
 
 ---
 
 ## 1. BattleManager
 
 Manages multiple concurrent battle rooms.
 
 ### Key Fields:
 - `rooms map[string]*Room` – active rooms, keyed by room ID
 - `mu sync.Mutex` – ensures safe concurrent access
 
 ### Key Methods:
 - `CreateRoom()` – creates a new battle room with a unique UUID, starts its hub, returns the room
 - `GetRoom(id string)` – retrieves a room by ID
 - `DeleteRoom(id string)` – stops a room's hub and removes it
 
 Each `Room` holds:
 - `ID` – unique room identifier
 - `Battle` – the battle simulation instance
 - `Hub` – WebSocket hub managing client connections
 
 ---
 
 ## 2. Hub
 
 Handles:
 - WebSocket connections for a single room
 - Game loop and tick updates
 - Broadcasting battle state
 - Receiving and processing client commands
 
 ### Fields:
 - `clients map[*websocket.Conn]bool` – active clients
 - `battle *battle.Battle` – associated battle instance
 - `addCh`, `rmCh`, `stopCh` – internal channels for concurrency
 
 ### Game Loop:
 1. Tick every 200ms:
 - `battle.Tick()` advances the simulation
 - Serialize `Troops` and `TickCount` into JSON
 - Broadcast to all connected clients
 2. Handle new connections (`AddClient`)
 3. Remove disconnected clients (`RemoveClient`)
 4. Stop hub and close connections on `stopCh`
 
 ### Client Messages:
 - JSON format for troop placement:
 
 ```json { "troopType": "knight", "team": "red", "x": 0, "y": 0 } ```
 
 - The hub parses messages and calls `battle.SpawnTroop(team, pos, troopType)`
 
 ---
 
 ## 3. Battle
 
 - Manages the game state for a single room.
 - Contains:
 - `Troops []troops.Entity` – all active entities
 - Tick counter (e.g., `TickCount`)
 - Responsible for:
 - Troop spawning
 - Movement and attack calculations each tick
 - Triggering `OnDelete` callback when the battle ends
 
 ---
 
 ## 4. Troops & Entities
 
 - `troops.Entity` – interface for any game unit
 - `troops.Troop` – base struct for a unit
 - Fields: `ID`, `Type`, `Health`, `Team`, `Position`, `Damage`, `Speed`, `Range`
 - `CalculateAction(MapView)` – AI logic for movement/attack
 - `GetTroop()`, `GetPosition()`, `GetTeam()` – helper methods
 
 ---
 
 ## 5. Room Lifecycle
 
 1. `BattleManager.CreateRoom()` → creates a new room, battle, and hub
 2. Clients connect via WebSocket to the hub
 3. Hub broadcasts battle updates every tick
 4. Clients send troop placement commands
 5. When battle ends, `OnDelete` triggers `BattleManager.DeleteRoom()`
 
 ---
 
 ## 6. Routes
 
 ### New Game Endpoint
 - `POST /newgame` → creates a new room and returns its ID:
 
 ```json { "roomID": "uuid-string" } ```
 
 - Use `BattleManager` to handle room creation and hub initialization
 
 ---
 
 ## 7. Notes & Best Practices
 
 - Only `Troops` slice and `TickCount` are sent to clients; the tile grid is internal
 - The hub handles all concurrency for connections and tick updates
 - Each room has its own battle and hub; multiple rooms can run concurrently
 - Always validate client messages; the hub logs invalid input
 
 ---
 
 This structure supports scalable, real-time battle simulations with multiple concurrent rooms and connected clients.

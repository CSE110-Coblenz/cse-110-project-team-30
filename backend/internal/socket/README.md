# Frontend Guide: Connecting to a Battle Room
 
 This guide explains step-by-step how to connect a frontend client to a battle instance via WebSockets and handle game updates.
 
 ## 1. Open a WebSocket Connection
 Use the browser's built-in `WebSocket` API. The URL points to your backend’s WebSocket endpoint.
 
 ```javascript // Connect to the battle server const ws = new WebSocket("ws://localhost:8080/ws"); // Connection opened ws.onopen = () => { console.log("Connected to battle server"); }; // Connection closed ws.onclose = () => { console.log("Disconnected from battle server"); }; // Handle errors ws.onerror = (err) => { console.error("WebSocket error:", err); }; ```
 
 ## 2. Join a Room
 Currently, a single server manages one battle by default. To support multiple rooms, you could send a `join` message specifying the room ID:
 
 ```javascript ws.send(JSON.stringify({ type: "join", room: "room-1" })); ```
 - `type`: `"join"` indicates you want to join a battle room
 - `room`: a string identifying the battle room
 
 The server should handle this message and associate your connection with the correct battle instance.
 
 ## 3. Spawn Troops (Optional)
 If your frontend allows placing troops:
 
 ```javascript ws.send(JSON.stringify({ type: "spawn", troopType: "knight", position: { x: 0, y: 0 } })); ```
 - `troopType`: the type of troop to spawn
 - `position`: `{ x, y }` coordinates on the map
 
 ## 4. Receive Game Updates
 The server broadcasts the battle state every tick. Each message contains:
 
 ```json { "tick": 42, "troops": [ { "ID": 1, "Type": "knight", "Team": 0, "Health": 100, "Position": { "X": 0, "Y": 0 }, "Damage": 10, "Speed": 1.0, "Range": 1 } ] } ```
 
 ### Handling messages in JS:
 
 ```javascript ws.onmessage = (event) => { const update = JSON.parse(event.data); console.log("Tick:", update.tick); console.log("Troops:", update.troops); // Render troops on the UI using update.troops }; ```
 
 ## 5. Tips
 - Always parse JSON safely to avoid crashes.
 - Use the `tick` to interpolate movement smoothly between updates.
 - Only send valid commands to the server; it will reject invalid positions or types.
 - Multiple clients can join the same room and receive synchronized updates.
 
 ## 6. Summary
 1. Open a WebSocket connection to `ws://localhost:8080/ws`.
 2. (Optional) Send a `join` message with a room ID.
 3. Send troop placement messages if needed.
 4. Listen for tick updates and render the battle state.
 5. Keep the connection alive to continuously receive updates.

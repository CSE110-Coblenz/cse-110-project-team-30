const log = document.getElementById("log");

function append(msg) {
  log.textContent += msg + "\n";
}

// Step 1: fetch a new game room
fetch("http://localhost:8080/newgame", {
  method: "POST"
})
  .then(res => res.json())
  .then(data => {
    const ROOM_ID = data.roomID;
    append("Got room ID: " + ROOM_ID);

    // Step 2: connect websocket for this room
    const ws = new WebSocket(`ws://localhost:8080/ws/${ROOM_ID}`);

    ws.onopen = () => {
      append("Connected to server");

      // Example: spawn a red knight at 0,0
      ws.send(JSON.stringify({
        team: "red",
        troopType: "SpearmanOne",
        x: 0,
        y: 0
      }));

      // Example: spawn a blue archer at 5,0
      ws.send(JSON.stringify({
        team: "blue",
        troopType: "ArcherTwo",
        x: 5,
        y: 0
      }));
    };

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        console.log(update);
        append(`Tick: ${update.tick}`);
        update.troops.forEach(t => {
          append(`Troop ${t.ID} (${t.Type}) - Team: ${t.Team} - Pos: (${t.Position.X}, ${t.Position.Y}) - Health: ${t.Health}`);
        });
      } catch (err) {
        append("Error parsing update: " + err);
      }
    };

    ws.onclose = () => append("Disconnected");
    ws.onerror = (err) => append("Error: " + err);
  })
  .catch(err => append("Failed to get new game: " + err));

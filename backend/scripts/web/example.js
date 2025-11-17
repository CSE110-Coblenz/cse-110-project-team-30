const log = document.getElementById("log");

function append(msg) {
  log.textContent += msg + "\n";
}

// Connect to websocket
const ws = new WebSocket("ws://localhost:8080/ws");

ws.onopen = () => {
  append("Connected to server");

  // Example: spawn a knight at 0,0
  ws.send(JSON.stringify({
    team: "red", // "red" or "blue"
    troopType: "knight",
    x: 0,
    y: 0
  }));
  // Example: spawn a knight at 0,0
  ws.send(JSON.stringify({
    team: "blue", // "red" or "blue"
    troopType: "knight",
    x: 5,
    y: 0
  }));
};

ws.onmessage = (event) => append("Received: " + event.data);

ws.onclose = () => append("Disconnected");

ws.onerror = (err) => append("Error: " + err);

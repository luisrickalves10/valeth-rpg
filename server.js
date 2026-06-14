const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const root = __dirname;
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/ws") {
    res.writeHead(426);
    res.end("WebSocket upgrade required");
    return;
  }

  const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const filePath = path.resolve(root, requested);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });
    res.end(data);
  });
});

const wss = new WebSocketServer({ noServer: true });
const rooms = new Map();

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname !== "/ws") {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.roomId = url.searchParams.get("room") || "LOBBY";
    wss.emit("connection", ws);
  });
});

wss.on("connection", (ws) => {
  if (!rooms.has(ws.roomId)) rooms.set(ws.roomId, new Set());
  rooms.get(ws.roomId).add(ws);

  ws.on("message", (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (message.type === "state") {
      broadcast(ws.roomId, message, ws);
      return;
    }

    broadcast(ws.roomId, message);
  });

  ws.on("close", () => {
    const room = rooms.get(ws.roomId);
    if (!room) return;
    room.delete(ws);
    if (room.size === 0) rooms.delete(ws.roomId);
  });
});

function broadcast(roomId, message, except = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const data = JSON.stringify(message);
  room.forEach((client) => {
    if (client !== except && client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

server.listen(port, host, () => {
  console.log(`Valeth RPG running at http://localhost:${port}`);
});

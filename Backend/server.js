import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // For devtunnels testing; restrict later to your exact frontend URL
    methods: ["GET", "POST"]
  }
});

let latestScore = null; // store the most recent data for reconnects

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Send the last known score to newly connected clients
  if (latestScore) {
    socket.emit("message", latestScore);
  }

  socket.on("message", (data) => {
    latestScore = data; // store for later
    io.emit("message", data); // broadcast live updates
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(9000, () => {
  console.log("🚀 Socket.IO server running on port 9000");
});

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "https://cric-scoreboard-1.onrender.com", // frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://cric-scoreboard-1.onrender.com", // must match frontend domain
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);
});

server.listen(9000, () => {
  console.log("Server running on port 9000");
});

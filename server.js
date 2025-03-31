import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

// Get current file directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Create HTTP server and Socket.io instance
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Default Vite dev server port
    methods: ["GET", "POST"]
  }
});

// Simple route for testing
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  socket.on("sendTranscription", (data) => {
    // Broadcast to all clients except the sender
    socket.broadcast.emit("transcription", data);
    console.log("Transcription received:", data.text);
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 3020;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
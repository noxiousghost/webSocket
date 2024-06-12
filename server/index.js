import express from "express";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3500;

const app = express();
const expressServer = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"], //5500 is default port for live server extension
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  // for connected users
  socket.emit("message", "Welcome to Chat App");

  // for all users except the one who's just connected
  socket.broadcast.emit(
    "message",
    `User ${socket.id.substring(0, 5)} connected`
  );

  // listening for message event
  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`); // sending message to all user
  });

  //for all users when an user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 5)} disconnected`
    );
  });

  // for checking message typing status
  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });
});

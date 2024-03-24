const http = require("http");
const fs = require("fs");
const url = require("url");
const { Server } = require("socket.io");
const { log } = require("console");

const server = http.createServer((req, res) => {
  let parsedUrl = url.parse(req.url);
  if (parsedUrl.pathname == "/") {
    responder("./index.html", "text/html", res);
  } else if (parsedUrl.pathname == "/style.css") {
    responder("./style.css", "text/CSS", res);
  } else if (parsedUrl.pathname == "/client.js") {
    responder("./client.js", "text/javascript", res);
  }
});

function responder(fileName, contentHeader, res) {
  res.statusCode = 200;
  res.setHeader("content-type", contentHeader);
  fs.readFile(fileName, (err, data) => {
    if (err) {
      return;
    } else {
      res.end(data);
    }
  });
}

let room = {};
server.listen(3000);

const io = new Server(server);

io.on("connection", (socket) => {
  let roomArray = Array.from(socket.rooms);
  console.log(roomArray);
  socket.on("join-room", (roomName) => {
    if (socket.rooms.has(roomName)) {
      console.log(socket.rooms);
      io.emit("message", "already-joined the room");
      return;
    }
    if (socket.rooms.size == 2) {
      roomArray = Array.from(socket.rooms);
      io.emit("message", `leave "${roomArray[1]}" room first`);
      return;
    }
    if (!room.hasOwnProperty(roomName)) {
      room[roomName] = [];
      room[roomName].push(socket.id);
      socket.join(roomName);
      io.to(roomName).emit("message", "waiting for player 2");
      console.log(room[roomName].length);
    } else {
      console.log(room[roomName].length);
      if (room[roomName].length == 2) {
        socket.emit("not-avail", roomName);
        return;
      }
      room[roomName].push(socket.id);
      socket.join(roomName);
      console.log(room);
      io.to(socket.id).emit("message", "room joined");
      roomArray = Array.from(socket.rooms);
      socket.to(roomName).emit("message", "player 2 has joined");
    }
  });
  socket.on("moved", (index) => {
    socket.broadcast.emit("other-moved", index);
  });

  socket.on("leave-room", (roomName) => {
    socket.leave(roomName);
    removeSocketFromRoom(socket.id);
    console.log(room);
    io.to(socket.id).emit("message", "room left");
    io.to(roomName).emit("message", "has left the room");
  });

  socket.on("disconnect", () => {
    removeSocketFromRoom(socket.id);
  });
});

function removeSocketFromRoom(id) {
  for (key in room) {
    let index = room[key].indexOf(id);
    if (index != -1) {
      room[key].splice(index, 1);
      if (room[key].length == 0) {
        delete room[key];
        return;
      }
    }
  }
}

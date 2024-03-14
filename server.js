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
  // join room
  socket.on("join-room", (roomName) => {
    let roomArray = Array.from(socket.rooms);
    console.log(roomArray);
    if (socket.rooms.has(roomName)) {
      io.emit("message","already-joined the room");
      return;
    }
    if (socket.rooms.size == 2) {
      io.emit("message",`leave "${roomArray[1]}" room first`);
      return;
    }
    if (!room.hasOwnProperty(roomName)) {
      room[roomName] = 1;
      socket.join(roomName);
      io.to(roomName).emit("message", "waiting for player 2");
    } else {
      if (room[roomName] == 2) {
        socket.emit("not-avail", roomName);
        return;
      }
      room[roomName]++;
    }
  });
  socket.on("moved", (index) => {
    socket.broadcast.emit("other-moved", index);
  });

  socket.on('leave-room',roomName =>{
    socket.leave(roomName);
    io.to(socket.id).emit("message","room left");
  })
});

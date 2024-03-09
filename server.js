const http = require("http");
const fs = require("fs");
const url = require("url");
const { Server } = require("socket.io");

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
    socket.join(roomName);
    if (!room.hasOwnProperty(roomName)) {
      room[roomName] = 1;
      console.log(room);
    } else {
      console.log("here");
      room[roomName] = 2;
      console.log(room);
    }
  });
  socket.on("moved", (index) => {
    socket.broadcast.emit("other-moved", index);
  });
});

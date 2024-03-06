const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url=="/") {
    res.setHeader("content-type","text/html");
    fs.readFile("./index.html",(err,data)=>{
      if (err) {
        res.end("no file");
        return;
      }
      res.end(data);
    })
  }
  if (req.url=="/style.css") {
    res.setHeader("content-type","text/css");
    fs.readFile("./style.css",(err,data)=>{
      if (err) {
        res.end("no file");
        return;
      }
      res.end(data);
    })
  }
  if (req.url=="/client.js") {
    res.setHeader("content-type", "text/javascript");
    fs.readFile("./client.js",(err,data)=>{
      if (err) {
        res.end("no file");
        return;
      }
      res.end(data);
    })
  }
});

server.listen(3000);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("connected");

  socket.on('moved',(index)=>{
    socket.broadcast.emit('update',index);
  })
});

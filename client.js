import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

let tableCells = document.querySelectorAll("td");
let form = document.querySelector("form");
let room = document.getElementById("inputField");
let leaveButton = document.getElementById("leave");
let roomName;
let id = 1;
let getid = "";
let message=""
let turn = false;
tableCells.forEach((ele) => {
  ele.id = id;
  ele.onclick = () => {
    console.log(roomName);
    if (!roomName || /^\s*$/.test(roomName)) {
      alert("join rooom first");
      return;
    }
    if (!turn) {
    alert(message);
      return;
    }
    ele.style.backgroundColor = "red";
    getid = ele.id;
    turn = false;
    socket.emit("moved", getid,roomName,true);
  };
  id++;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  roomName = room.value;
  if (/^\s*$/.test(roomName)) {
    alert("room canot be empty");
    return;
  }
  // if the socket name is not empty then let this socket join a room
  socket.emit("join-room", roomName);
});

// socket code suru

let socket = io();

socket.on("other-moved", (index,isturn) => {
  let x = document.getElementById(index);
  turn = isturn;
  console.log(x);
  x.style.backgroundColor = "blue";
});

socket.on("not-avail", (roomN) => {
  alert(`${roomN} is full`);
  roomName=false;
});

socket.on("message", (msg) => {
  alert(msg);
  message = msg;
});
socket.on("start-playing", (msg,isTurn) => {
  alert(msg);
  turn=isTurn;
});

leaveButton.onclick = () => {
  roomName = room.value;
  socket.emit("leave-room", roomName);
};

socket.emit("disconnect", roomName);

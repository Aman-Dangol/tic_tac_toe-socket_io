import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

let tableCells = document.querySelectorAll("td");
let form = document.querySelector("form");
let room = document.getElementById("inputField");
let roomnum;
let id = 1;
let getid = "";
let turn;
tableCells.forEach((ele) => {
  ele.id = id;
  ele.onclick = () => {
    if (!roomnum || /^\s*$/.test(roomnum)) {
      alert("join rooom first");
      return;
    }
    ele.style.backgroundColor = "red";
    getid = ele.id;
    socket.emit("moved", getid);
  };
  id++;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  roomnum = room.value;
  if (/^\s*$/.test(roomnum)) {
    alert("room canot be empty");
    return;
  }
  // if the socket name is not empty then let this socket join a room
  socket.emit("join-room", roomnum);
});

// socket code suru

let socket = io();

socket.on("other-moved", (index) => {
  let x = document.getElementById(index);
  console.log(x);
  x.style.backgroundColor = "blue";
});

socket.on("not-avail", (roomName) => {
  alert(`${roomName} is full`);
});

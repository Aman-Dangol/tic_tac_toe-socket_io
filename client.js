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
  socket.emit("join-room",roomnum);
});


// socket code suru

let socket = io();



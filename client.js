import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const socket = io();

let tableCells = document.querySelectorAll("td");
let id = 1;
tableCells.forEach((ele) => {
  ele.id = id;
  ele.onclick = () => {
    ele.style.backgroundColor = "red"
  };
  id++;
});

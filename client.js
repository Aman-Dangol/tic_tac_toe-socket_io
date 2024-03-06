import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const socket = io();

let tableCells = document.querySelectorAll("td");
let id = 1;
let getid="";
let turn;
tableCells.forEach((ele) => {
  ele.id = id;
  ele.onclick = () => {
    ele.style.backgroundColor = "red"
    getid = ele.id;
    socket.emit('moved',ele.id);
  };
  id++;
});

socket.on('update',(index)=>{
  tableCells.forEach(ele=>{
    if (ele.id == index) {
      ele.style.backgroundColor = "blue";
    }
  })
})
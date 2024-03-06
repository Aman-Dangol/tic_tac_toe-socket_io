import {io} from 'https://cdn.socket.io/4.7.4/socket.io.min.js'

const socket = io();

let tableRows = document.querySelectorAll("td");
let id = 1;
tableRows.forEach((ele) => {
  ele.id = id;
  id++;
});

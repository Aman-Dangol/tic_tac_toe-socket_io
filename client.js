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
    if (!roomnum) {
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
  if (room.value == "") {
    alert("join room first");
  }
});

import {  getSecondsLeftOfYear, getTimeString } from "./clock";

const timeContainer = document.getElementById("time");
const timeLeft = document.getElementById("seconds-left");

const render = () => {
  const now = new Date();
  timeLeft.innerText = getSecondsLeftOfYear(now);
  timeContainer.innerText = getTimeString(now);
}

render();
setInterval(render, 1000);
// There is a line of code here in the github repo
// + const unusedVariable 0 3;

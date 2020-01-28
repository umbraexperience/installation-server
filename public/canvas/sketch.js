let socket = io("/canvas")

var stars = [];

var speed = 1;

let conv = 0;

let state = false;

let tiemStarted;

function setup() {
  createCanvas(600, 600);
  for (var i = 0; i < 2000; i++) {
    stars[i] = new Star();
  }

  socket.on('message', (msg) => {
    state = msg
    console.log(msg)
    if (state) {
      tiemStarted = millis();
    } else conv = 0
  })
}

function draw() {

  if (state == 1) { conv = (millis() - tiemStarted) / 1000 }
  background(0, 0, 0);
  translate(width / 2, height / 2);
  for (var i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}
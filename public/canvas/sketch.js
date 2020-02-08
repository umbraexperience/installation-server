let socket = io("/canvas");

var stars = [];

var speed = 1;

let conv = 0;

let state = false;

let tiemStarted;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 2000; i++) {
    stars[i] = new Star();
  }

  socket.on("message", msg => {
    state = msg;
    console.log(msg);
    if (state) {
      tiemStarted = millis();
    } else {
      if (conv >= 0) {
        const interval = setInterval(() => {
          let down = conv * 0.1;
          conv = conv - down;
          speed = 1
          console.log("disminuint", conv);
          if (conv <= 0) {
            conv = 0;
            clearInterval(interval);
          }
        }, 10);
      } else {
        console.log("A zero", conv);
        conv = 0;
        speed = 1;
      }
    }
  });
}

function draw() {
  if (state == 1) {
    conv = (millis() - tiemStarted) / 1000;
    speed = 1 + (millis() - tiemStarted) / 1000;
  }
  background(0, 0, 0);
  translate(width / 2, height / 2);
  for (var i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// CS30 Major Project
// Dmitrii Pletmintsev
// 11/18/24
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


class Player {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = null;
    this.size = size;
  }

  move() {
    if (keyIsDown(65)) {
      this.x -= this.speed;
    }
  
    if (keyIsDown(68)) {
      this.x += this.speed;
    }
  
    if (keyIsDown(87)) {
      this.y -= this.speed;
    }
  
    if (keyIsDown(83)) {
      this.y += this.speed;
    }
  }

  display() {
    circle(player.x, player.y, 35);
    //image(this.image, this.x, this.y, this.size, this.size);
  }
}

let player = new Player(200, 200, 5, 100);

// function preload() {
//   player.image = loadImage("DarkKnightGif.gif");
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  rect(windowWidth/2 - 250, windowHeight/2 - 250, 500);
  player.move();
  player.display(); 
}


function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
}
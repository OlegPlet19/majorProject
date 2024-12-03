// CS30 Major Project
// Oleh Pletmintsev, Dmitrii Pletmintsev
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
    let newX = this.x;
    let newY = this.y;

    if (keyIsDown(65)) { // Left
      newX -= this.speed;
    }
    if (keyIsDown(68)) { // Right
      newX += this.speed;
    }
    if (keyIsDown(87)) { // Up
      newY -= this.speed;
    }
    if (keyIsDown(83)) { // Down
      newY += this.speed;
    }

    // Check if the new position is inside the room or bridges
    if (this.isInsideRoom(newX, newY) || this.isOnHorizontalBridge(newX, newY) || this.isOnVerticalBridge(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  isInsideRoom(x, y) {
    return ( // Return t/f if player inside room
      x >= room.x - room.size / 2 + this.size &&
      x <= room.x + room.size / 2 - this.size &&
      y >= room.y - room.size / 2 + this.size &&
      y <= room.y + room.size / 2 - this.size
    );
  }

  isOnHorizontalBridge(x, y) {
    return ( // Return t/f if player on Horizontal bridge
      // Up bridge
      (x >= upSideBridge.x + this.size &&
        x <= upSideBridge.x + upSideBridge.xSize - this.size &&
        y >= upSideBridge.y - this.size &&
        y <= upSideBridge.y + upSideBridge.ySize + this.size) ||
      // Bottom bridge
      (x >= bottomSideBridge.x + this.size &&
        x <= bottomSideBridge.x + bottomSideBridge.xSize -  this.size &&
        y >= bottomSideBridge.y - this.size &&
        y <= bottomSideBridge.y + bottomSideBridge.ySize + this.size)
    );
  }

  isOnVerticalBridge(x, y) {
    return ( // Return t/f if player on Vertical bridge
    //Right bridge
      (x >= rightSideBridge.x - this.size &&   
        x <= rightSideBridge.x + rightSideBridge.xSize + this.size &&
        y >= rightSideBridge.y + this.size &&
        y <= rightSideBridge.y + rightSideBridge.ySize - this.size) ||
      // Left bridge
      (x >= leftSideBridge.x - this.size &&
        x <= leftSideBridge.x + leftSideBridge.xSize + this.size &&
        y >= leftSideBridge.y + this.size &&
        y <= leftSideBridge.y + leftSideBridge.ySize - this.size)
    );
  }

  display() {
    // Player
    circle(this.x, this.y, this.size * 2);
  }
}

class Room {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display() {
    rect(this.x, this.y, this.size, this.size);
  }
}

// Main room
let room = {
  x: 1920 / 2,
  y: 1080 / 2,
  size: 200,
} ;

// Bridges
let rightSideBridge = {
  x : room.x + room.size / 2,
  y : room.y - 50,
  xSize : 300,
  ySize : 100,
  isOpen : false,
} ;

let leftSideBridge = {
  x : room.x - room.size / 2 - 300,
  y : room.y - 50,
  xSize : 300,
  ySize : 100,
  isOpen : false,
} ;

let upSideBridge = {
  x : room.x - 50,
  y : room.y - room.size / 2 - 300,
  xSize : 100,
  ySize : 300,
  isOpen : false,
} ;

let bottomSideBridge = {
  x : room.x - 50,
  y : room.y + room.size / 2,
  xSize : 100,
  ySize : 300,
  isOpen : false,
} ;

let player = new Player(room.x, room.y, 5, room.size/20);

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
  // Main room
  rect(room.x - room.size/2, room.y - room.size/2, room.size, room.size);

  // Right Bridge
  rect(rightSideBridge.x, rightSideBridge.y, rightSideBridge.xSize, rightSideBridge.ySize);
  // Left Bridge
  rect(leftSideBridge.x, leftSideBridge.y, leftSideBridge.xSize, leftSideBridge.ySize);
  // Up Bridge
  rect(upSideBridge.x, upSideBridge.y, upSideBridge.xSize, upSideBridge.ySize);
  // Bottom Bridge
  rect(bottomSideBridge.x, bottomSideBridge.y, bottomSideBridge.xSize, bottomSideBridge.ySize);

  // Draw player
  player.display();
  player.move();
}

function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
}

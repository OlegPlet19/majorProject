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

  moveInsideRoom() {
    // Need to set restrictions when on level separately from restrictions on bridge.
    if (keyIsDown(65) && 
    player.x >= room.x - room.size/2 + player.size
    ) { // Letf movement
      this.x -= this.speed;
    }
  
    if (keyIsDown(68) && 
    player.x <= room.x + room.size/2 - player.size
    ) { // Right movement
      this.x += this.speed;
    }
  
    if (keyIsDown(87) && 
    player.y >= room.y - room.size/2 + player.size
    ) { // Up movement
      this.y -= this.speed;
    }
  
    if (keyIsDown(83) && 
    player.y <= room.y + room.size/2 - player.size
    ) { // Down movenment
      this.y += this.speed;
    }
  }

  moveToBridge() {
    if (keyIsDown(65) && // Moving Left
    player.x <= room.x - room.size/2 + player.size && // Position of x outside of room
    player.y <= room.y + leftSideBridge.ySize - 50 && // Pos y to bridge
    player.y >= room.y - leftSideBridge.ySize + 50
    ) { // Letf movement
      this.x -= this.speed;
    }

    if (keyIsDown(68) && // Moving Right
    player.x >= room.x - room.size/2 + player.size && // Position of x outside of room
    player.y <= room.y + rightSideBridge.ySize - 50 && // Pos y to bridge
    player.y >= room.y - rightSideBridge.ySize + 50
    ) { // Right movement
      this.x += this.speed;
    }

    if (keyIsDown(87) && // Moving Up
    player.y <= room.y - room.size/2 + player.size && // Position of y outside of room
    player.x <= room.x + upSideBridge.xSize - 50 && // Pos x to bridge
    player.x >= room.x - upSideBridge.xSize + 50
    ) { // Up movement
      this.y -= this.speed;
    }

    if (keyIsDown(83) && // Moving Down
    player.y >= room.y - room.size/2 + player.size && // Position of y outside of room
    player.x <= room.x + bottomSideBridge.xSize - 50 && // Pos x to bridge
    player.x >= room.x - bottomSideBridge.xSize + 50
    ) { // Down movement
      this.y += this.speed;
    }
  }

  // moveInsideHorizontalBridge() {
  //   if (keyIsDown(87) && // Moving Up
  //   player.y <= leftSideBridge.y - leftSideBridge.ySize/2 + player.size && // Position of y outside of room
  //   player.y >= leftSideBridge.y + leftSideBridge.ySize/2 - player.size
  //   ) { // Up movement
  //     this.y -= this.speed;
  //   }
  // }

  display() {
    circle(player.x, player.y, 35);
  }
}

let room = {
  x : 1920/2,
  y : 1080/2,
  size : 500,
} ;

let rightSideBridge = {
  x : room.x + room.size/2,
  y : room.y - 100/2,
  xSize : 300,
  ySize : 100,
  isOpen : false,
} ;

let leftSideBridge = {
  x : room.x - room.size - 50,
  y : room.y - 100/2,
  xSize : 300,
  ySize : 100,
  isOpen : false,
} ;

let upSideBridge = {
  x : room.x - 100/2,
  y : room.y - room.size - 50,
  xSize : 100,
  ySize : 300,
  isOpen : false,
} ;

let bottomSideBridge = {
  x : room.x - 100/2,
  y : room.y + room.size/2,
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
  rect(room.x - room.size/2, room.y - room.size/2, room.size);

  // Right Bridge
  rect(rightSideBridge.x, rightSideBridge.y, rightSideBridge.xSize, rightSideBridge.ySize);
  // Left Bridge
  rect(leftSideBridge.x, leftSideBridge.y, leftSideBridge.xSize, leftSideBridge.ySize);
  // Up Bridge
  rect(upSideBridge.x, upSideBridge.y, upSideBridge.xSize, upSideBridge.ySize);
  // Bottom Bridge
  rect(bottomSideBridge.x, bottomSideBridge.y, bottomSideBridge.xSize, bottomSideBridge.ySize);

  // Player
  player.display(); 
  player.moveInsideRoom();
  player.moveToBridge();
  // player.moveInsideHorizontalBridge();
}

function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
}

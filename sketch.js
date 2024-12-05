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

    // Check if the new position is inside any room
    let isInsideRoom = false;
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].isInside(newX, newY, this.size)) {
        isInsideRoom = true;
        break;
      }
    }

    // Check if the new position is inside any bridge
    let isOnBridge = false;
    for (let i = 0; i < bridges.length; i++) {
      if (bridges[i].isOnBridge(newX, newY, this.size)) {
        isOnBridge = true;
        break;
      }
    }

    // If the new position is inside a room or on a bridge, update the player's position
    if (isInsideRoom || isOnBridge) {
      this.x = newX;
      this.y = newY;
    }
  }

  display() {
    circle(this.x + offsetX, this.y + offsetY, this.size * 2); // Player
  }
}

class Room {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  isInside(x, y) {
    return (    
      // If player is going to be fully located in room or bridge it is not able to move outside of them
      x >= this.x - this.size / 2 /* + player.size */ &&
      x <= this.x + this.size / 2 /* - player.size */ &&
      y >= this.y - this.size / 2 /* + player.size */ &&
      y <= this.y + this.size / 2 /* - player.size */
    );
  }

  display() {
    rect(
      this.x - this.size / 2 + offsetX,
      this.y - this.size / 2 + offsetY,
      this.size,
      this.size
    ); // Room
  }  
}

class Bridge {
  constructor(x, y, xSize, ySize) {
    this.x = x;
    this.y = y;
    this.xSize = xSize;
    this.ySize = ySize;
  }

  isOnBridge(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.xSize &&
      y >= this.y &&
      y <= this.y + this.ySize
    );
  }

  display() {
    rect(this.x + offsetX, this.y + offsetY, this.xSize, this.ySize); // Bridge
  }
}

let rooms = [];
let bridges = [];
let player;
let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateLevel(10); // Generation of a level with what ever # of rooms you set here
  player = new Player(rooms[0].x, rooms[0].y, 10, rooms[0].size / 20);
}

function draw() {
  background(220);

  // Drawing room
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].display();
  }

  // Drawing bridge
  for (let i = 0; i < bridges.length; i++) {
    bridges[i].display();
  }

  // Player
  player.display();
  player.move();

  cameraFollow();
}

function generateLevel(numRooms) {
  let roomSize = 500;
  let bridgeSize = 200;
  let distance = roomSize + bridgeSize * 3; // Distance between rooms

  // Central room
  let centerX = width / 2;
  let centerY = height / 2;
  rooms.push(new Room(centerX, centerY, roomSize));

  // Generating the remaining rooms
  while (rooms.length < numRooms) {
    let direction = random(["up", "down", "left", "right"]);
    let baseRoom = random(rooms); // Selecting a random room for expansion
    let x = baseRoom.x;
    let y = baseRoom.y;

    if (direction === "up") {
      y -= distance;
    } 
    else if (direction === "down") {
      y += distance;
    } 
    else if (direction === "left") {
      x -= distance;
    } 
    else if (direction === "right") {
      x += distance;
    }

    // We check if there is already a room at these coordinates
    let roomExists = false;

    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].x === x && rooms[i].y === y) {
        roomExists = true;
        break;
      }
    }

    if (!roomExists) {
      rooms.push(new Room(x, y, roomSize));
    }
  } 

  // Bridge Generation
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      let roomA = rooms[i];
      let roomB = rooms[j];

      // Calculating distance between rooms
      if (dist(roomA.x, roomA.y, roomB.x, roomB.y) === distance) {
        // Adding a bridge between rooms
        if (roomA.x === roomB.x) {
          // Vertical bridge
            // Creating bridges between rooms if their distance matches the specified one (be not perpendicular to line between rooms)
          let bridgeY = min(roomA.y, roomB.y) + roomSize / 2;
          bridges.push(new Bridge(roomA.x - bridgeSize / 2, bridgeY, bridgeSize, distance - roomSize));
        } else if (roomA.y === roomB.y) {
          // Horizontal bridge
            //Creating bridges between rooms if their distance matches the specified one (be not perpendicular to line between rooms)
          let bridgeX = min(roomA.x, roomB.x) + roomSize / 2;
          bridges.push(new Bridge(bridgeX, roomA.y - bridgeSize / 2, distance - roomSize, bridgeSize));
        }
      }
    }
  }
}

function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
}

function cameraFollow() {
  // Change (+- player.size * #) to change offset
  if (player.x + offsetX > width - player.size * 5) {
    offsetX -= player.speed;
  }
  if (player.x + offsetX < 0 + player.size * 5) {
    offsetX += player.speed;
  }
  if (player.y + offsetY > height - player.size * 5) {
    offsetY -= player.speed;
  }
  if (player.y + offsetY < 0 + player.size * 5) {
    offsetY += player.speed;
  }
}
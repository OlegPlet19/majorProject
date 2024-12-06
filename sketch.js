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
    this.visitedRoom = false;
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
    for (let room of rooms) {
      if (room.isOpen && room.isInside(newX, newY)) {
        isInsideRoom = true;
        break;
      }
    }

    // Check if the new position is inside any bridge
    let isOnBridge = false;
    for (let bridge of bridges) {
      if (bridge.isActive && bridge.isOnBridge(newX, newY)) {
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
    this.isOpen = false;
  }

  isInside(x, y) {
    return (    
      // If player is going to be fully located in room or bridge it is not able to move outside of them
      x >= this.x - this.size / 2 &&
      x <= this.x + this.size / 2 &&
      y >= this.y - this.size / 2 &&
      y <= this.y + this.size / 2
    );
  }

  display() {
    if (this.visitedRoom && this.isOpen) {
      fill(0, 255, 0); // green for open
    }
    else if (this.isOpen) {
      fill(250, 0, 0); // red for not visited rooms
    }
    else {
      fill(100); // dark grey for not opened
    }

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
    this.isActive = false;
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
    if (this.isActive) {
      fill(180);
      rect(this.x + offsetX, this.y + offsetY, this.xSize, this.ySize); // Bridge
    }
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
  rooms[0].isOpen = true; // Central room becomes open
  rooms[0].visitedRoom = true;
  activateInitialRooms(); // Making neuighbouring rooms connected
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
  let roomSize = 100;
  let bridgeSize = 50;
  let distance = roomSize + bridgeSize; // Distance between rooms

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
        } 
        else if (roomA.y === roomB.y) {
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

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    for (let room of rooms) {
      if (room.isOpen && room.isInside(player.x, player.y)) {
        activateConnectedRoomsAndBridges(room);
        room.visitedRoom = true;
        break;
      }
    }
  }
}

function activateConnectedRoomsAndBridges(room) {
  for (let bridge of bridges) {
    if (dist(room.x, room.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < room.size) {
      bridge.isActive = true;

      for (let otherRoom of rooms) {
        if (dist(otherRoom.x, otherRoom.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < room.size) {
          otherRoom.isOpen = true;
        }
      }
    }
  }
}

function activateInitialRooms() {
  const centralRoom = rooms[0]; // Central room
  
  for (let bridge of bridges) {
    // If the bridge is connected to the central passage
    if (dist(centralRoom.x, centralRoom.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < centralRoom.size) {
      bridge.isActive = true; // Activating the bridge

      for (let room of rooms) {
        // If the room is connected to an activated bridge
        if (dist(room.x, room.y, bridge.x + bridge.xSize / 2, bridge.y + bridge.ySize / 2) < centralRoom.size) {
          room.isOpen = true; // Making the room accessible
        }
      }
    }
  }
}

function cameraFollow() {
  // Magnitude to center number
  let magnitudeOfPlayerHorizontalOffset = width/player.size/2; 
  let magnitudeOfPlayerVerticalOffset = height/player.size/2;

  if (player.x + offsetX > width - player.size * magnitudeOfPlayerHorizontalOffset) {
    offsetX -= player.speed;
  }
  if (player.x + offsetX < 0 + player.size * magnitudeOfPlayerHorizontalOffset) {
    offsetX += player.speed;
  }
  if (player.y + offsetY > height - player.size * magnitudeOfPlayerVerticalOffset) {
    offsetY -= player.speed;
  }
  if (player.y + offsetY < 0 + player.size * magnitudeOfPlayerVerticalOffset) {
    offsetY += player.speed;
  }
}
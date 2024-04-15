"use strict";

// Controller

window.addEventListener("load", start);

function start() {
  console.log("JavaScript kører...");

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  createTiles();
  displayTiles();

  requestAnimationFrame(tick);
}

let lastTimestamp = 0;

function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);

  displayPlayerAtPosition();
  displayPlayerAnimation();

  showDebugging();
}

// Model
const player = {
  x: 0,
  y: 0,
  speed: 120,
  moving: false,
  direction: undefined,
};

const tiles = [
  [1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 0, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 3, 1, 1, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 3, 0, 1, 1, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 3, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0],
];

const GRID_HEIGHT = tiles.length; // row
const GRID_WIDTH = tiles[0].length; // col
const TILE_SIZE = 32;

function getTileAtCoordinate({ row, col }) {
  return tiles[row][col];
}

function CoordinateFromPosition({ x, y }) {
  const row = Math.round(y / TILE_SIZE);
  const col = Math.round(x / TILE_SIZE);
  const coordinate = { row, col };
  return coordinate;
}

function positionFromCoordinate() {}

function keyDown(event) {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      controls.right = true;
      break;
    case "a":
    case "ArrowLeft":
      controls.left = true;
      break;
    case "w":
    case "ArrowUp":
      controls.up = true;
      break;
    case "s":
    case "ArrowDown":
      controls.down = true;
      break;
  }
}

function keyUp(event) {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      controls.right = false;
      break;
    case "a":
    case "ArrowLeft":
      controls.left = false;
      break;
    case "w":
    case "ArrowUp":
      controls.up = false;
      break;
    case "s":
    case "ArrowDown":
      controls.down = false;
      break;
  }
}

const controls = {
  right: false,
  left: false,
  up: false,
  down: false,
};

// this function allows the player to only move in one direction at a time
function movePlayer(deltaTime) {
  player.moving = false; // reset moving state
  const speed = player.speed * deltaTime; // Calculate the distance to move based on speed and deltaTime

  const newPos = {
    x: player.x,
    y: player.y,
  };

  if (controls.right) {
    player.moving = true;
    player.direction = "right";
    newPos.x += speed;
  } else if (controls.left) {
    player.moving = true;
    player.direction = "left";
    newPos.x -= speed;
  } else if (controls.up) {
    player.moving = true;
    player.direction = "up";
    newPos.y -= speed;
  } else if (controls.down) {
    player.moving = true;
    player.direction = "down";
    newPos.y += speed;
  }

  if (canMoveTo(newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  }
}

function canMoveTo(pos) {
  if (pos.x < 0 || pos.x > 484 || pos.y < 0 || pos.y > 340) {
    return false;
  } else {
    return true;
  }
}

function displayPlayerAnimation() {
  const visualPlayer = document.querySelector("#player");

  if (player.moving) {
    visualPlayer.classList.add("animate");
    visualPlayer.classList.remove("up", "down", "right", "left");
    visualPlayer.classList.add(player.direction);
  } else {
    visualPlayer.classList.remove("animate");
  }
}

function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function createTiles() {
  const background = document.querySelector("#background");
  // For hvert af dem - lav en div med klassen item og tilføj til background, append
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      background.append(tile);
    }
  }
  background.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  background.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
  background.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");
}

function displayTiles() {
  const visualTiles = document.querySelectorAll("#background .tile");

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tileType = getTileAtCoordinate({ row, col });
      const visualTile = visualTiles[row * GRID_WIDTH + col];

      visualTile.classList.add(getClassForTileType(tileType));
    }
  }
}

function getClassForTileType(tileType) {
  switch (tileType) {
    case 0:
      return "grass";
    case 1:
      return "path";
    case 2:
      return "flowers";
    case 3:
      return "water";
    default:
      return "";
  }
}

function showDebugging() {
  showDebugTileUnderPlayer();
}

let lastPlayerCoordinate = { row: 0, col: 0 };

function showDebugTileUnderPlayer() {
  const coordinate = CoordinateFromPosition(player);

  if (
    coordinate.row != lastPlayerCoordinate.row ||
    coordinate.col != lastPlayerCoordinate.col
  ) {
    unHighlightTile(lastPlayerCoordinate);
    highlightTile(coordinate);
  }
  lastPlayerCoordinate = coordinate;
}

function highlightTile({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];
  visualTile.classList.add("highlight");
}

function unHighlightTile({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];
  visualTile.classList.remove("highlight");
}

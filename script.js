"use strict";

// Controller

window.addEventListener("load", start);

function start() {
  console.log("JavaScript kører...");

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  requestAnimationFrame(tick);
}

let lastTimestamp = 0;

function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);

  displayPlayerAtPosition();
}

// Model
const player = {
  x: 0,
  y: 0,
  speed: 150,
};

function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

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

/* // this functions allows a player to move in several directions at once
function movePlayer() {
  if (controls.right) {
    player.x++;
  } else if (controls.right) {
    player.x--;
  }

  if (controls.left) {
    player.x--;
  } else if (controls.left) {
    player.x++;
  }

  if (controls.up) {
    player.y--;
  } else if (controls.up) {
    player.y++;
  }

  if (controls.down) {
    player.y++;
  } else if (controls.down) {
    player.y--;
  }
} */

// this function allows the player to only move in one direction at a time
function movePlayer(deltaTime) {
  const speed = player.speed * deltaTime; // Calculate the distance to move based on speed and deltaTime
  if (controls.right) {
    player.x += speed;
  } else if (controls.left) {
    player.x -= speed;
  } else if (controls.up) {
    player.y -= speed;
  } else if (controls.down) {
    player.y += speed;
  }
}

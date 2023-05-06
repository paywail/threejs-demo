export let moveDirection = { left: 0, right: 0, forward: 0, back: 0 };

export function setupEventHandlers() {
  window.addEventListener("keydown", handleKeyDown, false);
  window.addEventListener("keyup", handleKeyUp, false);
}

function handleKeyDown(event) {
  let keyCode = event.keyCode;
  switch (keyCode) {
    case 87: //W: 
    case 38: //up 
      moveDirection.forward = 1;
      break;

    case 83: //S: BACK
    case 40: //down arrow
      moveDirection.back = 1;
      break;

    case 65: //A: LEFT
    case 37: //left arrow
      moveDirection.left = 1;
      break;

    case 68: //D: RIGHT
    case 39: //right arrow
      moveDirection.right = 1;
      break;
  }
}

function handleKeyUp(event) {
  let keyCode = event.keyCode;

  switch (keyCode) {
    case 87: //FORWARD
    case 38:
      moveDirection.forward = 0;
      break;

    case 83: //BACK
    case 40:
      moveDirection.back = 0;
      break;

    case 65: //LEFT
    case 37:
      moveDirection.left = 0;
      break;

    case 68: //RIGHT
    case 39:
      moveDirection.right = 0;
      break;
  }
}
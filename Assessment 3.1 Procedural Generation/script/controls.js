import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera, renderer } from './index.js'

export var controls = new OrbitControls( camera, renderer.domElement );

export var moveForward = false,
    moveBackwards = false,
    moveLeft = false,
    moveRight = false;

var OnKeyDown = function(event) {
  switch(event.keyCode) {
    case 38:
    case 87:
      console.log("up")
      moveForward = true;
      break;

    case 37:
    case 65:
    console.log("left")
    moveLeft = true;
      break;

    case 40:
    case 83:
      console.log("down")
      moveBackwards = true;
        break;
    case 39:
    case 68:
      console.log("right")
      moveRight = true;
        break;
  }
}

var OnKeyUp = function(event) {
  switch(event.keyCode) {
    case 38:
    case 87:
      moveForward = false;
      console.log("up release")
      break;
    case 37:
    case 65:
    moveLeft = false;
    console.log("left release")
      break;
    case 40:
    case 83:
      moveBackwards = false;
      console.log("down release")
        break;
    case 39:
    case 68:
      moveRight = false;
      console.log("right release")
        break;

  }
}

window.addEventListener('keydown', OnKeyDown, false); //on keydown trigger onkeyedown function
window.addEventListener('keyup', OnKeyUp, false);

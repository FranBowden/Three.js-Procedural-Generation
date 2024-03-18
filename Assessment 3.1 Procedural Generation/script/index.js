import * as THREE from 'three'
import { moveBackwards, moveLeft, moveForward, moveRight, controls } from './controls.js';
import {GUI} from '../node_modules/dat.gui/build/dat.gui.module.js'; //importing gui for control system

let scene = new THREE.Scene( ); //new scene

export var camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,1000); //perspective camera

camera.position.set(0,10,0); //set camera position 

export var renderer = new THREE.WebGLRenderer( );

renderer.setSize(window.innerWidth,window.innerHeight); //render size

document.body.appendChild(renderer.domElement);

function ClearScene() //clears the scene to refresh
{
  for (let i = scene.children.length - 1; i >= 0; i--)
    if(scene.children[i].type == "Mesh")
        scene.remove(scene.children[i]);
}

//frames and animation variables
 var FrameMatrix=[];
 var subFrames= 10;
 var currFrame=0;

var gui = new GUI(); //Dat.gui 
var clock = new THREE.Clock();
const deltaTime = clock.getDelta(); //makes sure the speed is the same on all devices
var speed = 10;

var cubes = []

var parameters = { //parameters to change objects
    scale: { x: 1, y: 1, z: 1, wSegment: 10, hSegment: 10 },
    tra: {x: 0, y: 0, z: 0},
    amount: 90,
    wireframe: true
};


var model = { //model object
  geometry: new THREE.BoxGeometry(),
  material: new THREE.MeshNormalMaterial( {
  wireframe: true,
 } ),
};

//Folders and Controls using dat.gui
var scaleFolder = gui.addFolder('Scale');
scaleFolder.add(parameters.scale, 'x', 0, 10).onChange(updateRender); //adding parameters and that will get updated 
scaleFolder.add(parameters.scale, 'y', 0, 10).onChange(updateRender);
scaleFolder.add(parameters.scale, 'z', 0, 10).onChange(updateRender);
scaleFolder.add(parameters.scale, 'wSegment', 0, 50).onChange(updateRender);
scaleFolder.add(parameters.scale, 'hSegment', 0, 50).onChange(updateRender);

var MoveFolder = gui.addFolder('Movement');
MoveFolder.add(parameters.tra, 'x', -50, 50).onChange(updateRender)
MoveFolder.add(parameters.tra, 'y', -50, 50).onChange(updateRender)
MoveFolder.add(parameters.tra, 'z', -50, 50).onChange(updateRender)

gui.add(parameters,'amount', 0, 100).onChange(updateRender);

gui.add(parameters, 'wireframe').onChange(function(value) {
  model.material.wireframe = value;
}) //checks whether wireframe is true or false

function CreateTransfMatrices() {
  for(var i = 0; i < (parameters.amount * subFrames); i++) { 
       
  
    var rotx = new THREE.Matrix4();
    var roty = new THREE.Matrix4();
    var rotz = new THREE.Matrix4();
    var sca = new THREE.Matrix4();
    var tra = new THREE.Matrix4();
    var combined = new THREE.Matrix4();
  
    //using the parameters to change scale and translation
    tra.makeTranslation(parameters.tra.x, parameters.tra.y, parameters.tra.z)
    sca.makeScale(parameters.scale.x, parameters.scale.y, parameters.scale.z);

    //rotation animation
    rotx.makeRotationX( i *(2 * Math.PI / (parameters.amount * subFrames)) )
    roty.makeRotationY( i *(2 * Math.PI / (parameters.amount * subFrames)) )
    rotz.makeRotationZ(i *(2 * Math.PI / (parameters.amount* subFrames)) )
  
   
    combined.multiply(rotx);
    combined.multiply(roty);
    combined.multiply(rotx);
    combined.multiply(tra);
    combined.multiply(sca);
    FrameMatrix[i]= combined; //get stored in framematrix array
  }
}

function CreateScene() {
  CreateTransfMatrices();
  for (var i = 0; i < parameters.amount; i++)  {
      
    cubes[i] = new THREE.Mesh(model.geometry, model.material) //creates the cube objects and stores them in an array
      
    var index = i*subFrames+currFrame;
    (index < FrameMatrix.length) ? cubes[i].applyMatrix4(FrameMatrix[index]) : console.error('Index out of bounds:', index); //applying the matrix 4 settings to the cubes
    scene.add(cubes[i]); //add the cubes to sceen 
    }
  }


var updateRender = () => { //update scene function
  model.geometry = new THREE.BoxGeometry(parameters.scale.x, parameters.scale.y, parameters.scale.z, parameters.scale.wSegment,  parameters.scale.hSegment) //updates the scale

  ClearScene() //calling clear scene 
  currFrame = (currFrame + 1) % subFrames; 
  CreateScene() //create scene again
  if (moveLeft) camera.position.x += speed * deltaTime;
  if (moveRight) camera.position.x -= speed * deltaTime;
  if (moveForward) camera.position.z += speed * deltaTime;
  if (moveBackwards) camera.position.z -= speed * deltaTime;
 

  renderer.render(scene, camera); //render scene

  controls.update(); //update controls
  requestAnimationFrame(updateRender);
};

requestAnimationFrame(updateRender);


var MyResize = function ()
{
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width,height);
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
};

window.addEventListener( 'resize', MyResize);


renderer.render(scene,camera); //render scene and camera
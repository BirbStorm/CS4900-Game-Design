import { createCamera } from './util/camera.js';
import { Terrain } from './util/terrain.js'
import { Water } from './util/water.js'
import * as controlsHelper from './util/controls.js'

import { modelLoader } from './util/modelLoader.js'
import { makeTextSprite } from './util/sprites.js'


export let scene;
export let isMouseDown;
export let pika;
export let terrain;
let width;
let height;
let camera;
let cameraHUD;
let sceneHUD;
let controls;
let renderer;
let keyboard = new THREEx.KeyboardState();
let container;

const mixers = []
const clock = new THREE.Clock();
const blocker = document.querySelector('#blocker')
const menu = document.getElementById( 'menu')
function main() {
  //sets container to the div within the HTML file
  container = document.body;
  scene = new THREE.Scene();

  // Create also a custom scene for HUD.
  sceneHUD = new THREE.Scene();

  // Create shortcuts for window size.
  var width = window.innerWidth;
  var height = window.innerHeight;


  loadModels();
  createRenderer();

  camera = createCamera();

  // Create the camera and set the viewport to match the screen dimensions.
  var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 100000 );
  cameraHUD.position.z = 10;


  // scene.add(camera)
  console.log(renderer)
  controls = controlsHelper.createControls(camera, renderer);
  scene.add(controls.getObject())
  console.log(controls.getObject())

  createLights();
  createFloor();
  createSkyBox();
  createHUD();
  //createHealthBar();
  createSprites();

  var axesHelper = new THREE.AxesHelper( 1 );
  scene.add( axesHelper );

  window.addEventListener( 'resize', onWindowResize );
  document.addEventListener( 'keydown', controlsHelper.onKeyDown, false );
  document.addEventListener( 'keyup', controlsHelper.onKeyUp, false );
  document.addEventListener("mousemove", controlsHelper.onMouseMove);
  document.addEventListener("mousedown", () => isMouseDown = true);
  document.addEventListener("mouseup", () => isMouseDown = false);
  
}
function loadModels(){
  modelLoader('../assets/models/Animations/pikaRunning.glb', new THREE.Vector3(0, 0, 0), 'pika')
  modelLoader('../assets/models/untitled.glb', new THREE.Vector3(0, 5, 0), 'charmander');
}

function createLights() {
    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    // const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

    const mainLight = new THREE.DirectionalLight( 0xffffff, 2 );
    mainLight.position.set( 10, 20, 20 );
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 5)
    hemiLight.position.set(10,10,-10)
    scene.add(   mainLight,hemiLight );


}

function createFloor(){
    //creates a basic floor for testing purposes
    let floor = Water();

    floor.position.x = Math.PI /2;
    floor.position.y = -0.5;
    scene.add(floor);
  floor.rotation.x = Math.PI / 2;
  terrain = Terrain()
  scene.add(terrain)
}

function createSkyBox(){
    //creates a skybox around play area
    let skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    let skyBoxMats = 
    [
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( '../assets/textures/skybox/front.JPG' ),
        side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( '../assets/textures/skybox/back.JPG' ),
        side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( '../assets/textures/skybox/up.JPG' ),
        side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( '../assets/textures/skybox/down.JPG' ),
        side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( '../assets/textures/skybox/right.JPG' ),
        side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( '../assets/textures/skybox/left.JPG' ),
        side: THREE.DoubleSide})
    ];
    let skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMats)
    let ambient = new THREE.AmbientLight(0xFFFFFF, 0.3)

    scene.add(skyBox, ambient);
}


function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;

  renderer.physicallyCorrectLights = true;

  document.body.appendChild( renderer.domElement );
}

function createSprites(){
  var spritey = makeTextSprite( " World! ", 
  { fontsize: 10, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
  spritey.position.set(-30,-10,0);
  scene.add( spritey );
}


function createHUD(){


  // We will use 2D canvas element to render our HUD.  
  var hudCanvas = document.createElement('canvas');

  // Again, set dimensions to fit the screen.
  hudCanvas.width = width;
  hudCanvas.height = height;

  // Get 2D context and draw something supercool.
  var hudBitmap = hudCanvas.getContext('2d');
	hudBitmap.font = "Normal 40px Arial";
  hudBitmap.textAlign = 'center';
  hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
  hudBitmap.fillText('Initializing...', width / 2, height / 2);


  
 
 
	// Create texture from rendered graphics.
	var hudTexture = new THREE.Texture(hudCanvas) 
  hudTexture.needsUpdate = true;
  
  // Create HUD material.
  var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
  material.transparent = true;

  // Create plane to render the HUD. This plane fill the whole screen.
  var planeGeometry = new THREE.PlaneGeometry( width, height );
  var plane = new THREE.Mesh( planeGeometry, material );
  sceneHUD.add( plane );
}

function createHealthBar(){
  
}

function update() {
  const delta = clock.getDelta();

  for ( const mixer of mixers ) {

    mixer.update( delta );

  }
}

function animate() {
  requestAnimationFrame(animate)
  pika = scene.getObjectByName("pika")
  controlsHelper.updateControls()
  //renderer.clear();
  renderer.render( scene, camera );
  //renderer.clearDepth();
  //renderer.render(sceneHUD, cameraHUD);
}

function onWindowResize() {
  //this function resets the camera size based on changing window size
  camera.aspect = window.innerWidth / window.innerHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth , window.innerHeight );

}



  
  
Ammo().then((AmmoLib) => {
  Ammo = AmmoLib
  main()
  animate()
})

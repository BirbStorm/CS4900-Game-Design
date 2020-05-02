import { createCamera } from './util/camera.js';
import { generateTerrain } from './util/terrain.js'
import * as controlsHelper from './util/controls.js'

import { modelLoader } from './util/modelLoader.js'
import { initPhysics, updatePhysics, physicsWorld } from './util/physics.js';


export let scene;
export let isMouseDown;
export let player;
export let terrain;

let camera;
let container;
let controls;
let renderer;

export let dynamicObjects = []
export let loadingManager;
export const mixers = []
const clock = new THREE.Clock();
const blocker = document.querySelector('#blocker')
const menu = document.getElementById( 'menu')


function main() {
  loadingManager = new THREE.LoadingManager( () => {

    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );

    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

} );


  
  //sets container to the div within the HTML file
  container = document.body;
  scene = new THREE.Scene();


  // Create shortcuts for window size.
  var width = window.innerWidth;
  var height = window.innerHeight;

  loadModels();
  createRenderer();

  camera = createCamera();

  // Create the camera and set the viewport to match the screen dimensions.
  var cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 100000 );
  cameraHUD.position.z = 10;


  controls = controlsHelper.createControls(camera, renderer);
  scene.add(controls.getObject())

  terrain = generateTerrain()
  scene.add(terrain)
  createLights();
  createFloor();
  createSkyBox();

  initPhysics()
  var axesHelper = new THREE.AxesHelper( 1 );
  scene.add( axesHelper );
  var dir = new THREE.Vector3( 0, -2, 0 );

  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  var origin = new THREE.Vector3( -200, 0, 900 );
  var length = 1;
  var hex = 0xffff00;
  
  var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  scene.add( arrowHelper );
  window.addEventListener( 'resize', onWindowResize );
  document.addEventListener( 'keydown', controlsHelper.onKeyDown, false );
  document.addEventListener( 'keyup', controlsHelper.onKeyUp, false );
  document.addEventListener("mousemove", controlsHelper.onMouseMove);
  document.addEventListener("mousedown", () => isMouseDown = true);
  document.addEventListener("mouseup", () => isMouseDown = false);
}

function loadModels(){

  modelLoader('../assets/models/Robot.glb', new THREE.Vector3(0, 150, 0), 'player', 1,0)
  modelLoader('../assets/models/Trex.glb', new THREE.Vector3(50, 200, 100), 'trex', 1,0)
  modelLoader('../assets/models/alien.glb', new THREE.Vector3(25, 200, 100), 'player', 1,0)
  modelLoader('../assets/models/slime.glb', new THREE.Vector3(10, 200, 100), 'slime', 1,0)
  modelLoader('../assets/models/Rat.glb', new THREE.Vector3(30, 200, 100), 'rat',1,0)

}



function createLights() {
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    // const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

    const mainLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    mainLight.position.set( 10, 20, 20 );
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.5)
    hemiLight.position.set(10,10,-10)
    scene.add(   mainLight,hemiLight );


}

function createFloor(){
  // creates a basic floor for testing purposes
  let flowMap = new THREE.TextureLoader().load('assets/textures/water/Water_1_M_Flow.jpg')
  let waterGeometry = new THREE.PlaneBufferGeometry( 4096, 4096);
  let water = new THREE.Water( waterGeometry, {
      scale: 2,
      textureWidth: 4096,
      textureHeight: 4096,
      flowMap: flowMap

  } );
  water.position.y = 15;
  water.rotation.x = Math.PI * - 0.5;
          
  var helperGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
  var helperMaterial = new THREE.MeshBasicMaterial( { map: flowMap } );
  var helper = new THREE.Mesh( helperGeometry, helperMaterial );
  helper.position.y = 15.01;
  helper.rotation.x = Math.PI * - 0.5;
  helper.visible = false;

  scene.add(water,helper);
  
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


function update() {
  const delta = clock.getDelta();
  for ( const mixer of mixers ) {

    mixer.update( delta );

  }
}

function animate() {
  requestAnimationFrame(animate)
  update()
  player = scene.getObjectByName("player")
  controlsHelper.updateControls()
  updatePhysics(clock.getDelta())
  renderer.render( scene, camera );

}

function onWindowResize() {
  //this function resets the camera size based on changing window size
  camera.aspect = window.innerWidth / window.innerHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth , window.innerHeight );
  //console.log(player)
}

function onTransitionEnd( event ) {
  event.target.remove();    
}
  
  
Ammo().then((AmmoLib) => {
  Ammo = AmmoLib
  main()
  animate()
})


import { createCamera } from './util/camera.js';
import { Terrain } from './util/terrain.js'
import * as controlsHelper from './util/controls.js'

import { modelLoader } from './util/modelLoader.js'


export let scene;
export let isMouseDown;
export let pika;
export let terrain;
let camera;
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


  loadModels();
  createRenderer();

  camera = createCamera();
  // scene.add(camera)
  console.log(renderer)
  controls = controlsHelper.createControls(camera, renderer);
  scene.add(controls.getObject())
  console.log(controls.getObject())

  createLights();
  createFloor();
  createSkyBox();

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
  // creates a basic floor for testing purposes
  let flowMap = new THREE.TextureLoader().load('assets/textures/water/Water_1_M_Flow.jpg')
  let waterGeometry = new THREE.PlaneBufferGeometry( 8196, 8196);
  let water = new THREE.Water( waterGeometry, {
      scale: 2,
      textureWidth: 4096,
      textureHeight: 4096,
      flowMap: flowMap

  } );
  water.position.y = -1;
  water.rotation.x = Math.PI * - 0.5;
          
  var helperGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
  var helperMaterial = new THREE.MeshBasicMaterial( { map: flowMap } );
  var helper = new THREE.Mesh( helperGeometry, helperMaterial );
  helper.position.y = 1.01;
  helper.rotation.x = Math.PI * - 0.5;
  helper.visible = false;

  scene.add(water,helper);
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
  renderer.render( scene, camera );
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


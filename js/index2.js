import { createCamera } from './camera.js';
import { Terrain } from './terrain.js'
import * as controlsHelper from './controls.js'

import { modelLoader } from './modelLoader.js'



let camera;
let controls;
export let scene;
let renderer;
let container;
let keyboard = new THREEx.KeyboardState();
const mixers = []
const clock = new THREE.Clock();
const blocker = document.querySelector('#blocker')
export let pika;
const menu = document.getElementById( 'menu')
let prevTime = performance.now()
function main() {
  //sets container to the div within the HTML file
  container = document.body;
  scene = new THREE.Scene();

  menu.addEventListener('click', () => controls.lock(), false)

  loadModels();

  camera = createCamera();
  // scene.add(camera)
  console.log(pika)
  controls = controlsHelper.createControls(camera);
  scene.add(controls.getObject())
  console.log(controls.getObject())

  createLights();
  createFloor();
  createSkyBox();
  createRenderer();

  var axesHelper = new THREE.AxesHelper( 1 );
  scene.add( axesHelper );

  window.addEventListener( 'resize', onWindowResize );
  document.addEventListener( 'keydown', controlsHelper.onKeyDown, false );
	document.addEventListener( 'keyup', controlsHelper.onKeyUp, false );
}
function loadModels(){
//basic model loader for GLTF files

  const loader = new THREE.GLTFLoader();
  // loader.load('../assets/models/Animations/pikaRunning.glb', 
  // (model, pos = new THREE.Vector3(0,0,0)) => {
  //   const pika = model.scene
  //   pika.position.copy(pos)
  //   scene.add(pika)
  //   pika.name = "pika"
  //   console.log(pika)
  // }, 
  // () => {}, 
  // (error) => console.log(error))
  // loader.load('../assets/models/untitled.glb', 
  // (model, pos = new THREE.Vector3(0,5,0)) => {
  //   const pika = model.scene
  //   pika.position.copy(pos)
  //   scene.add(pika)
  //   console.log(pika)
  // }, 
  // () => {}, 
  // (error) => console.log(error))
  modelLoader('../assets/models/Animations/pikaRunning.glb', new THREE.Vector3(0, 0, 0), 'pika')
  modelLoader('../assets/models/untitled.glb', new THREE.Vector3(0, 5, 0), 'charmander');
  // modelLoader('../assets/models/charmander/scene.gltf', new THREE.Vector3(-10, 0, -10));
  // modelLoader('../assets/models/squirtle/scene.gltf', new THREE.Vector3(5, 0, 5));
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
    let floorTexture = new THREE.TextureLoader().load('../assets/textures/waterpic.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(16,16)
    let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
    let floorGeometry = new THREE.PlaneGeometry(8192, 8192, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.x = Math.PI /2;
    floor.position.y = -0.5;
    scene.add(floor);
  floor.rotation.x = Math.PI / 2;
  
  scene.add(Terrain())
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



  
  

main()
animate()
let camera;
let controls;
let scene;
let renderer;
let container;
let keyboard = new THREEx.KeyboardState();
const mixers = []
const clock = new THREE.Clock();
let pika;


function main() {
  //sets container to the div within the HTML file
  container = document.querySelector('#game');
  scene = new THREE.Scene();


  loadModels();

  createCamera();
  createControls();
  createLights();
  createFloor();
  createSkyBox();
  createRenderer();


  renderer.setAnimationLoop( () => {
      update();
      render();
  });
}
function loadModels(){
//basic model loader for GLTF files

  const loader = new THREE.GLTFLoader();
  loader.load('../assets/models/pika.glb', 
  (model, pos = new THREE.Vector3(0,0,0)) => {
    const pika = model.scene
    pika.position.copy(pos)
    scene.add(pika)
    pika.name = "pika"
    console.log(pika)
  }, 
  () => {}, 
  (error) => console.log(error))

}
function createCamera() {
  //creates initial camera
	camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 0.1, 100000 );
  camera.position.set( 0.25, -0.25, 10 );
  scene.add(camera);
	camera.lookAt(scene.position);

}

function createControls() {
  controls = new THREE.OrbitControls( camera, container );
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0)});
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
    let floorTexture = new THREE.ImageUtils.loadTexture('../assets/textures/checkerboard.jpg')
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10,10)
    let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.x = Math.PI /2;
    floor.position.y = -0.5;
    scene.add(floor);
	floor.rotation.x = Math.PI / 2;
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
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild( renderer.domElement );
}

function update() {
  const delta = clock.getDelta();

  for ( const mixer of mixers ) {

    mixer.update( delta );

  }
}

function render() {
  renderer.render( scene, camera );
}

function onWindowResize() {
  //this function resets the camera size based on changing window size
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();
  renderer.setSize( container.clientWidth, container.clientHeight );

}


function controlUpdate() {
  pika = scene.getObjectByName("pika")
  const delta = clock.getDelta();

  //Basic movement of player
  // if(keyboard.pressed("W"))
  //     pika.translateZ(moveDist);

  // if(keyboard.pressed("S"))
  //   pika.translateZ(-moveDist);
  // if(keyboard.pressed("A"))
  //   pika.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
  // if(keyboard.pressed("D"))
  //   pika.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle);
  // if ( keyboard.pressed("Q") )
  //   pika.translateX( -moveDist );
  // if ( keyboard.pressed("E") )
  //   pika.translateX(  moveDist );	


  //creates a vector of camera position behind player if player was at origin and applies
  //matrix against players current position in the world
  var relativeCameraOffset = new THREE.Vector3(0,5,-20);
	var cameraOffset = relativeCameraOffset.applyMatrix4(pika.matrixWorld );
  
  //sets camera position and has camera looking at player
	camera.position.x = cameraOffset.x;
	camera.position.y = cameraOffset.y;
	camera.position.z = cameraOffset.z;
	camera.lookAt( pika.position );
}
  
  
  
window.addEventListener( 'resize', onWindowResize );
window.addEventListener("keydown", controlUpdate)

main()
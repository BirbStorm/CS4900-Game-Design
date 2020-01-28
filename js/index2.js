let camera;
let controls;
let scene;
let renderer;
let container;
const mixers = []
const clock = new THREE.Clock();

function main() {
    container = document.querySelector('#game');
    scene = new THREE.Scene();

    createCamera();
    createControls();
    createLights();
    createFloor();
    createSkyBox();
    loadModels();
    createRenderer();

    renderer.setAnimationLoop( () => {
        update();
        render();
    });
}
function loadModels(){
    const loader = new THREE.GLTFLoader();
    loader.load('../models/pika.glb', 
    (model, pos = new THREE.Vector3(0,0,0)) => {
      const pika = model.scene
      pika.position.copy(pos)
      scene.add(pika)
      console.log(pika)
    }, 
    () => {}, 
    (error) => console.log(error))
    loader.load('../models/soldier1.gltf', 
    (model, pos = new THREE.Vector3(10,0,0)) => {
      const pika = model.scene
      pika.position.copy(pos)
      scene.add(pika)
      console.log(pika)
    }, 
    () => {}, 
    (error) => console.log(error))

}
function createCamera() {
    camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 0.1, 10000 );
    camera.position.set( 0.25, -0.25, 10 );
    scene.add(camera)
}

function createControls() {
  controls = new THREE.OrbitControls( camera, container );
}

function createLights() {
    const color = 0xFFFFFF;
    const intensity = 500;
    const light = new THREE.AmbientLight(color, intensity);
    light.position.set(5,5,10)
    scene.add(light);
    // const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

    const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
    mainLight.position.set( 5, 5, 10 );
  
    scene.add(  mainLight );

}

function createFloor(){
    let floorTexture = new THREE.ImageUtils.loadTexture('../models/checkerboard.jpg')
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10,10)
    let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.x = Math.PI /2;
    floor.position.y = 3;
    scene.add(floor);
	floor.rotation.x = Math.PI / 2;

}

function createSkyBox(){
    // let skyBoxGeometry = new THREE.CubeGeometry(10000,10000,10000);
    // let skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,side:THREE.BackSide});
    // let skyBox = new THREE.Mesh(skyBoxGeometry,skyBoxMaterial);
    // scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025)
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

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

main()
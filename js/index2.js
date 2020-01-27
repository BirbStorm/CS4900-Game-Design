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
    loader.load('../models/Flamingo.glb', 
    (model, pos = new THREE.Vector3(0,0,2.5)) => {
      const soldier = model.scene.children[0]
      scene.add(soldier)
      console.log(scene)
      soldier.position.copy(pos)
    }, 
    () => {}, 
    (error) => console.log(error))
}
function createCamera() {
    camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 100 );
    camera.position.set( 0.25, -0.25, 6.5 );
    scene.add(camera)
}

function createControls() {
  controls = new THREE.OrbitControls( camera, container );
}

function createLights() {
    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    // const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

    const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
    mainLight.position.set( 10, 10, 10 );
  
    scene.add(  mainLight );

}

function createFloor(){
    let floorMaterial = new THREE.MeshBasicMaterial();
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.x = Math.PI /2;
    floor.position.y = -0.5;
    scene.add(floor);
}

function createSkyBox(){
    // let skyBoxGeometry = new THREE.CubeGeometry(10000,10000,10000);
    // let skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,side:THREE.BackSide});
    // let skyBox = new THREE.Mesh(skyBoxGeometry,skyBoxMaterial);
    // scene.add(skyBox);
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
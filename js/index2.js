let camera;
let controls;
let scene;
let renderer;
let container;

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

}
function createCamera() {
    camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 100 );
    camera.position.set( -1.5, 1.5, 6.5 );
}

function createControls() {

}

function createLights() {

}

function createFloor(){
    let floorMaterial = new THREE.MeshBasicMaterial();
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.x = Math.PI /2;
    floor.position.y = -0.5
    scene.add(floor)

}

function createSkyBox(){

}

function createRenderer() {

}

function update() {

}

function render() {

}
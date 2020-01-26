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

function createRenderer() {

}

function update() {

}

function render() {

}
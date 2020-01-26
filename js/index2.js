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
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
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
    let skyBoxGeometry = new THREE.CubeGeometry(10000,10000,10000);
    let skyBoxMaterial = new THREE.MeshBasicMaterial({color: rgb(135,206,235),side:THREE.BackSide});
    let skyBox = new THREE.Mesh(skyBoxGeometry,skyBoxMaterial);
    scene.add(skyBox);
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
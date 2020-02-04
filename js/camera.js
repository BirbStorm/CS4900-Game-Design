let container = document.body;
let camera
export function createCamera() {
    //creates initial camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
    camera.position.set( 0.25, -0.25, 10 );
    camera.setViewOffset(window.innerWidth, window.innerHeight, 200, 0, window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    return camera;
  
}
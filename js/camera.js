export function createCamera(width, height) {
    //creates initial camera
    let camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 100000 );
    camera.position.set( 0.25, -0.25, 10 );
    return camera;
  
  }
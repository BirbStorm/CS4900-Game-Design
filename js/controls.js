import { pika } from './index2.js'
const container = document.body;
const menu = document.querySelector('#menu');
const blocker = document.querySelector('#blocker')
let controls;
let moveForward = false
let moveLeft = false
let moveBackward = false 
let moveRight = false
let rotateLeft = false
let rotateRight = false
let oldX

let prevTime = performance.now();
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()
export function createControls(camera){
    controls = new THREE.PointerLockControls( camera, container )
    
    menu.addEventListener( 'click', () => {

        controls.lock();

    }, false );
    controls.addEventListener( 'lock', () => {
        blocker.style.display = 'none';
        menu.style.display = 'none';
        console.log(controls.isLocked)
    } );

    controls.addEventListener( 'unlock', () => {
        blocker.style.display = 'block';
        menu.style.display = '';

    } );
    controls.addEventListener('mousemove', (event) => console.log(event))

    return controls;
}

export const onKeyDown = ( event ) => {
    switch( event.keyCode ) {
        case 87: //w
            moveForward = true
            break
        case 65: //a
            moveLeft = true
            break
        case 83: //s
            moveBackward = true
            break
        case 68: //d
            moveRight = true
            break
    }
};
export const onMouseMove = (event) => {
    const {
        movementX,
        movementY
    } = event;
    let val = (controls.getDirection(new THREE.Vector3()))
    if (val.x < 0.0){
        rotateRight = true
        rotateLeft = false
    }
    else if (val.x > 0.0){
        rotateLeft = true
        rotateRight = false
    }
    else if (val.x == controls.getDirection(new THREE.Vector3()).x){
        rotateLeft = false
        rotateRight = false
    }
}
export const onKeyUp = ( event ) => {
    switch( event.keyCode ) {
        case 87: //w
            moveForward = false
            break
        case 65: //a
            moveLeft = false
            break
        case 83: //s
            moveBackward = false
            break
        case 68: //d
            moveRight = false
            break
    }
}

export function updateControls() {
    if( controls.isLocked ) {
        let time = performance.now();
        let delta = ( time - prevTime ) / 1000;
        //console.log(delta)
        let rotateAngle = Math.PI / 2 * delta
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        
        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= (direction.z * 400.0 * delta);
        if ( moveLeft || moveRight ) velocity.x -= (direction.x * 400.0 * delta);
        if ( rotateLeft )  pika.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
        if ( rotateRight )  pika.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle);


        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
        pika.translateZ(- velocity.z * delta)
        pika.translateX(- velocity.x * delta)
        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        if ( controls.getObject().position.y < 5 ) {
            velocity.y = 0;
            controls.getObject().position.y = 5;
        }
        var relativeCameraOffset = new THREE.Vector3(0,5,-20);
        var cameraOffset = relativeCameraOffset.applyMatrix4(pika.matrixWorld )
        controls.getObject().position.x = cameraOffset.x
        controls.getObject().position.y = cameraOffset.y
        controls.getObject().position.z = cameraOffset.z
        controls.getObject().lookAt(pika.position)
        prevTime = time;
    }
    else{
        velocity = new THREE.Vector3(0,0,0)
    }
}
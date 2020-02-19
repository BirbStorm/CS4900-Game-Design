
import { player, isMouseDown, terrain } from '../index2.js'
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
let sprint = false
let crouch = false
let oldX = 0
let raycaster
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
    raycaster = new THREE.Raycaster(new THREE.Vector3(),new THREE.Vector3(0, -1, 0))
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
        case 16: //shift
            sprint = true
            break
        case 17: //control
            crouch = true
            break
    }
};
export const onMouseMove = (event) => {
    if(controls.isLocked && isMouseDown){
        const {
            movementX,
            movementY
        } = event;
        let val = movementX
        if (val < 0){
            rotateRight = false
            rotateLeft = true
        }
        else if (val > 0){
            rotateLeft = false
            rotateRight = true
        }
        else if (val == oldX){
            rotateLeft = false
            rotateRight = false
        }
        oldX = val
    }
    else{
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
        case 16: //shift
            sprint = false
            break
        case 17: //control
            crouch = false
            break
    }
}

export function updateControls() {
    if( controls.isLocked ) {

        let time = performance.now();
        let delta = ( time - prevTime ) / 1000;
        //console.log(delta)
        let rotateAngle = Math.PI / 4 * delta
        velocity.x -= velocity.x * 10.0 * delta;
        //console.log(velocity)
        velocity.z -= velocity.z * 10.0 * delta;
        //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        
        
        raycaster.ray.origin.copy( player.position );
        raycaster.ray.origin.y -= 10;
        //console.log(raycaster.intersectObject(terrain, true))
        
        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        //If both sprint and crouch are pressed, crouch will not be activated
        if (sprint && crouch){
            crouch = false;
        }

        if ( moveForward ){
            if ( sprint ){
                velocity.z -= (direction.z * 400.0 * delta) * .75;
            }
            else if (crouch){
                velocity.z -= (direction.z * 400.0 * delta) * 0.5;
            }
            else{
                velocity.z -= (direction.z * 400.0 * delta);
            }
        }
        if ( moveBackward ){
            if(crouch){
                velocity.z -= (direction.z * 400.0 * delta) * 0.5;
            }
            else{
                velocity.z -= (direction.z * 400.0 * delta);
            }
        } 
        if ( moveLeft || moveRight ){
            if (crouch){
                velocity.x -= -(direction.x * 400.0 * delta) * 0.5;
            }
            else{
                velocity.x -= -(direction.x * 400.0 * delta);
            }
        }
        if ( rotateLeft )  player.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
        if ( rotateRight )  player.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle);

        
        player.translateZ(- velocity.z * delta)
        player.translateX(- velocity.x * delta)
        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 5 ) {
            velocity.y = 0;
            controls.getObject().position.y = 5;
        }
        //Lowers the camera for crouching
        if (crouch){
            var relativeCameraOffset = new THREE.Vector3(0,4,-10);
        }
        else{
            var relativeCameraOffset = new THREE.Vector3(0,5,-10);
        }
        var cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld )
        controls.getObject().position.x = cameraOffset.x
        controls.getObject().position.y = cameraOffset.y
        controls.getObject().position.z = cameraOffset.z
        controls.getObject().lookAt(player.position)

        prevTime = time

    }

    else if(player !== undefined){

        velocity = new THREE.Vector3(0,0,0)
    }


}

import { player, isMouseDown, terrain, mixers } from '../index2.js'
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
let raycaster = new THREE.Raycaster()
let down = new THREE.Vector3(-1,-1,-1)
let prevTime = performance.now();
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()

let idleAction
let runAction
let actions


let physicsBody
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
    if( controls.isLocked && player !== undefined) {
        physicsBody = player.userData.physicsBody;

        let time = performance.now();
        let delta = ( time - prevTime ) / 1000;
        //console.log(delta)
        // let rotateAngle = Math.PI / 4 * delta
        // velocity.x -= velocity.x * 10.0 * delta;
        // //console.log(velocity)
        // velocity.z -= velocity.z * 10.0 * delta;
        // //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        
        
        // raycaster.set( player.position, down );
        // let cols = (raycaster.intersectObject(terrain))
        // // let cols = []
        // console.log(cols)
        // if(cols[0])
        //     player.position.y = cols[0].point.y + 2.5
        // direction.z = Number( moveForward ) - Number( moveBackward );
        // direction.x = Number( moveRight ) - Number( moveLeft );
        // direction.normalize(); // this ensures consistent movements in all directions

        // //If both sprint and crouch are pressed, crouch will not be activated
        // if (sprint && crouch){
        //     crouch = false;
        // }

        // if ( moveForward ){
        //     if ( sprint ){
        //         velocity.z -= (direction.z * 400.0 * delta) * 2;
        //     }
        //     else if (crouch){
        //         velocity.z -= (direction.z * 400.0 * delta) * 0.5;
        //     }
        //     else{
        //         velocity.z -= (direction.z * 400.0 * delta);
        //     }
        // }
        // if ( moveBackward ){
        //     if(crouch){
        //         velocity.z -= (direction.z * 400.0 * delta) * 0.5;
        //     }
        //     else{
        //         velocity.z -= (direction.z * 400.0 * delta);
        //     }
        // } 
        // if ( moveLeft || moveRight ){
        //     if (crouch){
        //         velocity.x -= -(direction.x * 400.0 * delta) * 0.5;
        //     }
        //     else{
        //         velocity.x -= -(direction.x * 400.0 * delta);
        //     }
        // }
        if ( rotateLeft )  player.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
        if ( rotateRight )  player.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle);
        let moveX =  Number( moveRight ) - Number( moveLeft );
        let moveZ =  Number( moveForward ) - Number( moveBackward );
        let moveY =  0;
    
        let vertex = new THREE.Vector3(moveX,moveY,moveZ);
        vertex.applyQuaternion(player.quaternion);
        if( moveX == 0 && moveY == 0 && moveZ == 0) return;
        let factor = 100
        let resultantImpulse = new Ammo.btVector3( -vertex.x, 0, vertex.z );
        resultantImpulse.op_mul(factor);

        physicsBody.setLinearVelocity ( resultantImpulse );
 
        if (crouch){
            var relativeCameraOffset = new THREE.Vector3(0,4,-10);
        }
        else{
            var relativeCameraOffset = new THREE.Vector3(0,5,-10);
        }

        var cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld )
        controls.getObject().position.copy(player.position)
        controls.getObject().position.y += 4
        controls.getObject().position.z -= 10

        controls.getObject().lookAt(player.position)

        prevTime = time

    }

    else if(player !== undefined){
        physicsBody = player.userData.physicsBody;

        physicsBody.setLinearVelocity ( new Ammo.btVector3( 0, 0, 0 ) );
    }


}




function activateAllActions(){
    actions.forEach( function ( action ) {
        action.play();
    } );
}

function prepareCrossFade( startAction, endAction, defaultDuration ){
    var duration = defaultDuration;
    if (startAction === idleAction){
        executeCrossFade(startAction, endAction, duration)
    } else{
        synchronizeCrossFade(startAction, endAction, duration);
    }
}

function synchronizeCrossFade(startAction, endAction, duration){
    mixers[0].addEventListener('loop', onLoopFinished);
    function onLoopFinished(event){
        if (event.action === startAction){
            mixers[0].removeEventListener('loop', onLoopFinished);
            executeCrossFade(startAction, endAction, duration);
        }
    }
}

function executeCrossFade(startAction, endAction, duration){
    setWeight(endAction, 1);
    endAction.time = 0;
    startAction.crossFadeTo(endAction, duration, true);
}

function setWeight(action, weight){
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
}

//Timeout needed because character mixer hasnt been created yet
setTimeout(function(){
    idleAction = mixers[0].clipAction(player.animations[0])
    runAction = mixers[0].clipAction(player.animations[1])
    actions = [idleAction, runAction]
    activateAllActions();
 }, 6000);

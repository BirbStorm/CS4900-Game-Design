
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

let danceAction
let deathAction
let idleAction
let jumpAction
let noAction
let punchAction
let runAction
let sitAction
let standAction
let thumbsUpAction
let walkAction
let walkJumpAction
let waveAction
let yesAction
let currentAction
let playerMixer
let actions
let count = 0

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
            if(currentAction != walkAction){
                prepareCrossFade(idleAction, walkAction, 1.0);
                currentAction = walkAction;
            }
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
            if(currentAction === walkAction){
                prepareCrossFade(walkAction, idleAction, 1.0);
                currentAction = idleAction;
            }
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
        physicsBody = player.userData.physicsBody;

        let time = performance.now();
        let delta = ( time - prevTime ) / 1000;
        let rotateAngle = Math.PI / 2 * delta

        // raycaster.set( player.position, down );
        // let cols = (raycaster.intersectObject(terrain))
        // // let cols = []
        // // console.log(cols)
        // if(cols[0])
        //     player.position.y = cols[0].point.y + 2.5
        // direction.z = Number( moveForward ) - Number( moveBackward );
        // direction.x = Number( moveRight ) - Number( moveLeft );
        // direction.normalize(); // this ensures consistent movements in all directions

        //If both sprint and crouch are pressed, crouch will not be activated
        if (sprint && crouch){
            crouch = false;
        }

        if ( rotateLeft )  player.rotateOnAxis(new THREE.Vector3(0,1,0), rotateAngle);
        if ( rotateRight )  player.rotateOnAxis(new THREE.Vector3(0,1,0), -rotateAngle);
        let moveX =  Number( moveRight ) - Number( moveLeft );
        let moveZ =  Number( moveForward ) - Number( moveBackward );
        if (sprint){
            moveZ = moveZ*2
        }
        let moveY =  0;

        let vertex = new THREE.Vector3(moveX,moveY,moveZ);
        vertex.applyQuaternion(player.quaternion);
        let factor = 100
        if(sprint)
            factor = factor * 2
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
        controls.getObject().position.x = cameraOffset.x
        controls.getObject().position.y = cameraOffset.y
        controls.getObject().position.z = cameraOffset.z
        controls.getObject().lookAt(player.position)
        prevTime = time

    }
    else if(player !== undefined){
        physicsBody = player.userData.physicsBody;

        physicsBody.setLinearVelocity ( new Ammo.btVector3( 0, 0, 0 ) );
    }


}




function activateAllActions(){
    let i
    for (i = 0; i < actions.length; i++) {
        setWeight(actions[i], 0.0);
    }
    setWeight(idleAction, 1.0);

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
    playerMixer.addEventListener('loop', onLoopFinished);
    function onLoopFinished(event){
        if (event.action === startAction){
            playerMixer.removeEventListener('loop', onLoopFinished);
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
    playerMixer = mixers.find(mixer => mixer.getRoot().name == 'player')

    danceAction = playerMixer.clipAction(player.animations[0])
    deathAction = playerMixer.clipAction(player.animations[1])
    idleAction = playerMixer.clipAction(player.animations[2])
    jumpAction = playerMixer.clipAction(player.animations[3])
    noAction = playerMixer.clipAction(player.animations[4])
    punchAction = playerMixer.clipAction(player.animations[5])
    runAction = playerMixer.clipAction(player.animations[6])
    sitAction = playerMixer.clipAction(player.animations[7])
    standAction = playerMixer.clipAction(player.animations[8])
    thumbsUpAction = playerMixer.clipAction(player.animations[9])
    walkAction = playerMixer.clipAction(player.animations[10])
    walkJumpAction = playerMixer.clipAction(player.animations[11])
    waveAction = playerMixer.clipAction(player.animations[12])
    yesAction = playerMixer.clipAction(player.animations[13])

    currentAction = idleAction;
    actions = [danceAction, deathAction, idleAction, jumpAction, noAction, punchAction, runAction, sitAction, standAction, thumbsUpAction, walkAction, walkJumpAction, waveAction, yesAction]
    activateAllActions();
 }, 10000);
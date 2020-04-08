
import { player, isMouseDown, terrain, mixers } from '../index2.js'
import { playerLanded } from './physics.js';
const container = document.body;
const menu = document.querySelector('#menu');
const known = document.querySelector('#known');
const blocker = document.querySelector('#blocker')
const play = document.querySelector('#play')
const death = document.querySelector('#death')
const list = document.querySelector('#list')


let controls;
let moveForward = false
let moveLeft = false
let moveBackward = false 
let moveRight = false
let rotateLeft = false
let rotateRight = false
let sprint = false
let crouch = false
let jump = false
let punch = false
let oldX = 0
let raycaster = new THREE.Raycaster()
let down = new THREE.Vector3(-1,-1,-1)
let prevTime = performance.now();
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()
let listener = new THREE.AudioListener();
let sound = new THREE.Audio( listener );

export let danceAction,
deathAction,
idleAction,
jumpAction,
noAction,
punchAction,
runAction,
sitAction,
standAction,
thumbsUpAction,
walkAction,
backwardAction,
walkJumpAction,
waveAction,
yesAction,
currentAction,
playerMixer,
actions
let count = 0



let physicsBody
export function createControls(camera){
    controls = new THREE.PointerLockControls( camera, container )
    
    play.addEventListener( 'click', () => {

        controls.lock();

    }, false );
    controls.addEventListener( 'lock', () => {
        blocker.style.display = 'none';
        menu.style.display = 'none';
        play.style.display = 'none';
        console.log(controls.isLocked)
    } );
    list.addEventListener('click',() =>{
        menu.style.display= 'none';
        known.style.display = 'block';
    })
    controls.addEventListener( 'unlock', () => {
        blocker.style.display = 'block';
        menu.style.display = '';
        play.style.display = '';

    } );
    return controls;
}


export const onKeyDown = ( event ) => {
    if (currentAction === deathAction){
        return false;
    }
    else{
        switch( event.keyCode ) {
            case 90: //z
                died();
                break;
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
                if (playerLanded){
                    sprint = true
                }
                break
            case 17: //control
                crouch = true
                break
            case 32: //space
                if (jump == false && jumpAction.getEffectiveWeight() == 0 && walkJumpAction.getEffectiveWeight() == 0){
                    jump = true;
                    if (moveForward){
                        prepareCrossFade(currentAction, walkJumpAction, 1);
                        prepareCrossFade(currentAction, currentAction, 2);
                    }
                    else{
                        prepareCrossFade(currentAction, jumpAction, 1);
                        prepareCrossFade(currentAction, currentAction, 0.6);
                    }
                }
                break
            case 86: //v
                if (punch == false){
                    punch = true;
                    prepareCrossFade(currentAction, punchAction, 0.6);
                    prepareCrossFade(currentAction, currentAction, 0.6);
                }
                break
        }
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
    if (currentAction === deathAction){
        return false;
    }
    else{
        switch( event.keyCode ) {
            case 87: //w
                moveForward = false
                if(currentAction === walkAction){
                    prepareCrossFade(currentAction, idleAction, 0.6);
                    currentAction = idleAction;
                }
                break
            case 65: //a
                moveLeft = false
                break
            case 83: //s
                moveBackward = false
                if(currentAction === backwardAction){
                    prepareCrossFade(backwardAction, idleAction, 0.6);
                    currentAction = idleAction;
                }
                break
            case 68: //d
                moveRight = false
                break
            case 16: //shift
                sprint = false
                if (moveForward){
                    prepareCrossFade(currentAction, walkAction, 1.0);
                    currentAction = walkAction;
                }
                break
            case 17: //control
                crouch = false
                break
            case 32: //space
                jump = false
                break
            case 86: //v
                punch = false
                break
        }
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

        
        let moveX =  Number( moveRight ) - Number( moveLeft );
        let moveZ =  Number( moveForward ) - Number( moveBackward );
        //Moving forward
        if (moveZ == 1){
            if (sprint){
                moveZ = moveZ*2
                if(currentAction != runAction){
                    prepareCrossFade(currentAction, runAction, 1.0);
                    currentAction = runAction;
                }
            }
            else if(currentAction != walkAction && currentAction != runAction){
                prepareCrossFade(currentAction, walkAction, 0.6);
                currentAction = walkAction;
            }
        }
        //Moving backward
        else if (moveZ == -1){
            //Sets the walking animation to play backwards
            backwardAction.timeScale = -1;
            if(currentAction != backwardAction){
                prepareCrossFade(currentAction, backwardAction, 0.6);
                currentAction = backwardAction;
            }
        }
        if (!playerLanded){
            moveZ = moveZ * 3
        }
        //Sprint, only forward
        /*if (sprint && moveZ == 1){
            moveZ = moveZ*2
            if(currentAction != runAction){
                prepareCrossFade(currentAction, runAction, 1.0);
                currentAction = runAction;
            }
        }*/
        let moveY =  0;

            let vertex = new THREE.Vector3(moveX,moveY,moveZ);
            vertex.applyQuaternion(player.quaternion);
            let factor = 100
            if(sprint)
                factor = factor * 2
            let resultantImpulse = new Ammo.btVector3( -vertex.x, 0, vertex.z );
            resultantImpulse.op_mul(factor);

            physicsBody.setLinearVelocity ( resultantImpulse );
            if ( rotateLeft )  physicsBody.applyTorque(new Ammo.btVector3(0,1,0), 100);
            if ( rotateRight )  physicsBody.applyTorque(new Ammo.btVector3(0,1,0), -100);
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

export function died(){
    if(currentAction != deathAction){
        executeCrossFade(currentAction, deathAction, 3.0);
        currentAction = deathAction;
        death.style.opacity = '1';

        let music = document.getElementById('music');
        music.pause();

        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( '../../assets/audio/scream.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( false );
            sound.setVolume( 0.8 );
            sound.play();
        });


    }
}




export function activateAllActions(){
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
    backwardAction = playerMixer.clipAction(player.animations[10])
    walkJumpAction = playerMixer.clipAction(player.animations[11])
    waveAction = playerMixer.clipAction(player.animations[12])
    yesAction = playerMixer.clipAction(player.animations[13])

    currentAction = idleAction;
    actions = [danceAction, deathAction, idleAction, jumpAction, noAction, punchAction, runAction, sitAction, standAction, thumbsUpAction, walkAction, backwardAction, walkJumpAction, waveAction, yesAction]
    
    //Sets ceratin actions to only play once
    jumpAction.setLoop(THREE.LoopOnce);
    walkJumpAction.setLoop(THREE.LoopOnce);
    punchAction.setLoop(THREE.LoopOnce);
    deathAction.clampWhenFinished = true;
    deathAction.setLoop(THREE.LoopOnce);
    sitAction.clampWhenFinished = true;
    sitAction.setLoop(THREE.LoopOnce);

    setWeight(sitAction, 1.0);
    sitAction.play();

    //activateAllActions();
 }, 5000);
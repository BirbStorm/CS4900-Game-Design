import { dynamicObjects, player} from '../index2.js'
import { heightMap } from './terrain.js';
import{playerExsists} from './modelLoader.js';
import {died, activateAllActions} from './controls.js';
//import{takeDamage} from 'index.html';

// Heightfield parameters

let music = document.getElementById('music');
let flying = document.getElementById('flying');
let listener = new THREE.AudioListener();
let sound = new THREE.Audio( listener );
var terrainWidth = 1024;
var terrainDepth = 1024;
var terrainHalfWidth = terrainWidth / 2;
var terrainHalfDepth = terrainDepth / 2;
var terrainMaxHeight = 220;
var terrainMinHeight = 0;

// Physics variables
var collisionConfiguration;
var dispatcher;
var broadphase;
var solver;
let groundContact = null;
export let playerLanded = false;
export var physicsWorld;
// var dynamicObjects = [];
var transformAux1;
var heightData = null;
var ammoHeightData = null;
let groundBody;
let test;
let qt;
export let groundExsists;
groundExsists = false;
export function initPhysics() {
    heightData = heightMap
    // Physics configuration
    groundContact = new Ammo.ConcreteContactResultCallback();
    groundContact.addSingleResult = () =>{
        // let bar = document.querySelector("#hpbar");
        // bar.style.width = (bar.clientWidth -1) + 'px';
        // if (bar.style.width == "0px"){
        //     died();
        // }
        test = groundTransform.getRotation()
        qt = THREE.Quaternion(test.x(),test.y(),test.z(),test.w())
        //console.log(test.x(),test.y(),test.z(),test.w())
    }
        //Changes to normal gravity on contact with ground
    groundContact.addSingleResult = function(){
        physicsWorld.setGravity( new Ammo.btVector3( 0, -100, 0 ) );
        if(!playerLanded){
            playerLanded = true;
            activateAllActions();
            music.play();
            getSoundAndFadeAudio('flying');
            powerUpSound();
        }
    }
    
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
    //Gravity used for dropping
    physicsWorld.setGravity( new Ammo.btVector3( 0, -10000, 0 ) );

    physicsWorld.debugDrawWorld();
    // Create the terrain body

    var groundShape = createTerrainShape();
    var groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    // Shifts the terrain, since bullet re-centers it on its bounding box.
    groundTransform.setOrigin( new Ammo.btVector3( 0, ( terrainMaxHeight + -terrainMinHeight ) / 2, 0 ) );
    var groundMass = 0;
    var groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
    var groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
    groundBody = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( groundMass, groundMotionState, groundShape, groundLocalInertia ) );
    physicsWorld.addRigidBody( groundBody, 3, 1 );
    transformAux1 = new Ammo.btTransform();
    groundExsists = true;
}


function createTerrainShape() {

    // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
    var heightScale = 1;

    // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
    var upAxis = 1;

    // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
    var hdt = "PHY_FLOAT";

    // Set this to your needs (inverts the triangles)
    var flipQuadEdges = false;

    // Creates height data buffer in Ammo heap
    ammoHeightData = Ammo._malloc(4 *  terrainWidth * terrainDepth );

    // Copy the javascript height data array to the Ammo one.
    var p = 0;
    var p2 = 0;
    for ( var j = 0; j < terrainDepth; j ++ ) {

        for ( var i = 0; i < terrainWidth; i ++ ) {

            // write 32-bit float data to memory
            Ammo.HEAPF32[ ammoHeightData + p2 >> 2 ] = heightData[ p ];
            p ++;

            // 4 bytes/float
            p2 += 4;

        }

    }

    // Creates the heightfield physics shape
    var heightFieldShape = new Ammo.btHeightfieldTerrainShape(
        terrainWidth,
        terrainDepth,
        ammoHeightData,
        heightScale,
        terrainMinHeight,
        terrainMaxHeight,
        upAxis,
        hdt,
        flipQuadEdges
    );

    // // Set horizontal scale
    // var scaleX = terrainWidthExtents / ( terrainWidth - 1 );
    // var scaleZ = terrainDepthExtents / ( terrainDepth - 1 );
    // heightFieldShape.setLocalScaling( new Ammo.btVector3( scaleX, 1, scaleZ ) );

    // heightFieldShape.setMargin( 0.05 );

    return heightFieldShape;

}

export function updatePhysics( deltaTime ) {

    physicsWorld.stepSimulation( deltaTime, 10 );
    // Update objects

    if(playerExsists && groundExsists) physicsWorld.contactPairTest(player.userData.physicsBody,groundBody,groundContact);
    

    for ( let i in dynamicObjects ) {
        
        var objThree = dynamicObjects[ i ];
        var objPhys = objThree.userData.physicsBody;
        var ms = objPhys.getMotionState();
        if ( ms ) {
            ms.getWorldTransform( transformAux1 );
            var p = transformAux1.getOrigin();
            var q = (transformAux1.getRotation());
            // if(groundExsists)
            //  console.log(groundTransform.getRotation())
            objThree.position.set( p.x(), p.y(), p.z() );
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
            // console.log(objThree)
        }

    }


}


export function getSoundAndFadeAudio (audiosnippetId) {

    var sound = document.getElementById(audiosnippetId);

    // Set the point in playback that fadeout begins. This is for a 2 second fade out.
    var fadePoint = sound.duration - sound.duration - 2; 

    var fadeAudio = setInterval(function () {

        // Only fade if past the fade out point or not at zero already
        if ((sound.currentTime >= fadePoint) && (sound.volume != 0.0)) {
            sound.volume = sound.volume - 0.1;
        }
        // When volume at zero stop all the intervalling
        if (sound.volume <= 0.0001) {
            clearInterval(fadeAudio);
            sound.volume = 0.0;
            sound.pause();
        }
    }, 200);

}

function powerUpSound(){
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../../assets/audio/powerUp.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.8 );
        sound.play();
    });
}
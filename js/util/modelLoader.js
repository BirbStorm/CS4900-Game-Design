import { scene, dynamicObjects, loadingManager, mixers } from '../index2.js'
import { physicsWorld } from './physics.js'

export function modelLoader( path, pos, name ){
	const loader = new THREE.GLTFLoader(loadingManager);
	loader.load(path, 
	(model) => onLoad(model, pos, name),
	() => progress(),
	(error) => console.log(error))
}

function onLoad( model, pos, name ){
    let bbox = null
    const character = model.scene
    //character.scale.set(0.005, 0.005, 0.005)

    character.position.copy(pos)
    character.name = name
    let vect3 = new THREE.Vector3();
    let box = new THREE.Box3().setFromObject(model.scene).getSize(vect3);

    // let transform = new Ammo.btTransform();
    // transform.setIdentity();
    // transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    // transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
    // let motionState = new Ammo.btDefaultMotionState( transform );

    // let colShape = new Ammo.btBoxShape(new Ammo.btVector3(box.x/2.5, box.y/3, box.z/2.5));
    // colShape.setMargin( 0.5 );

    // let localInertia = new Ammo.btVector3( 0, 0, 0 );
    // colShape.calculateLocalInertia( 1, localInertia );

    // let rbInfo = new Ammo.btRigidBodyConstructionInfo( 1, motionState, colShape, localInertia );
    // let objBody = new Ammo.btRigidBody( rbInfo );

    // objBody.setFriction(4);
    // objBody.setRollingFriction(10);

    //physicsWorld.addRigidBody( objBody );

    scene.add(character)


    let mixer = new THREE.AnimationMixer( character );
    mixers.push(mixer);
    character.userData.animations = model.animations
    character.userData.mixer = mixer
    character.userData.mixer.clipAction(character.userData.animations[0]).play();
    character.userData.hampus = "see custom"
    console.log(character)

}

function progress(){
	
}
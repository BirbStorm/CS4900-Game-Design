import { scene, dynamicObjects, loadingManager, mixers} from '../index2.js'
import { physicsWorld } from './physics.js'
export let playerExsists;
// export function modelLoader( path, pos, name ){
// 	const loader = new THREE.GLTFLoader(loadingManager);
// 	loader.load(path, 
// 	(model) => onLoad(model, pos, name),
// 	() => progress(),
// 	(error) => console.log(error))
// }

export function modelLoader( path, pos, name ,mass,type){
	const loader = new THREE.GLTFLoader(loadingManager);
	loader.load(path, 
	(model) => onLoad(model, pos, name,mass,type),
	() => progress(),
	(error) => console.log(error))
}
function onLoad( model, pos, name,mass,type){
    const character = model.scene
    //character.scale.set(0.005, 0.005, 0.005)

    character.position.copy(pos)
    character.name = name
    let vect3 = new THREE.Vector3();
    let box = new THREE.Box3().setFromObject(model.scene).getSize(vect3);
    console.log(box)
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(box.x/2.5, box.y/1.5, box.z/2.5));
    colShape.setMargin( 0.05 );
    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( 1, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let objBody = new Ammo.btRigidBody( rbInfo );
    //objBody.translate(Ammo.btVector3(0,0,0))
    character.userData.physicsBody = objBody
    character.userData.physicsBody.set;
    objBody.setFriction(10);
    objBody.setRollingFriction(10);
    objBody.setActivationState(4)
    physicsWorld.addRigidBody( objBody , 1, 3);

    scene.add(character)
    dynamicObjects.push(character)
    let mixer = new THREE.AnimationMixer( character );
    mixers.push(mixer);
    character.animations = model.animations
    character.mixer = mixer

    if(!character.name == "player"){
        character.mixer.clipAction(character.animations[0]).play();
    }
    playerExsists = true;
}


// function onLoad( model, pos, name ){
//     const character = model.scene

//     character.position.copy(pos)
//     character.name = name
//     let vect3 = new THREE.Vector3();
//     let box = new THREE.Box3().setFromObject(model.scene).getSize(vect3);
//     console.log(box)
//     let transform = new Ammo.btTransform();
//     transform.setIdentity();
//     transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
//     transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
//     let motionState = new Ammo.btDefaultMotionState( transform );

//     let colShape = new Ammo.btBoxShape(new Ammo.btVector3(box.x/2.5, box.y/1.5, box.z/2.5));
//     colShape.setMargin( 0.05 );
//     let localInertia = new Ammo.btVector3( 0, 0, 0 );
//     colShape.calculateLocalInertia( 1, localInertia );

//     let rbInfo = new Ammo.btRigidBodyConstructionInfo( 1, motionState, colShape, localInertia );
//     let objBody = new Ammo.btRigidBody( rbInfo );

//     character.userData.physicsBody = objBody
//     character.userData.physicsBody.set;
//     objBody.setFriction(10);
//     objBody.setRollingFriction(10);

//     physicsWorld.addRigidBody( objBody );

//     scene.add(character)
//     dynamicObjects.push(character)
//     let mixer = new THREE.AnimationMixer( character );
//     mixers.push(mixer);
//     character.animations = model.animations
//     character.mixer = mixer

//     if(!character.name == "player"){
//         character.mixer.clipAction(character.animations[0]).play();
//     }
//     else
//         playerExsists = true;
// }

function progress(){
	
}
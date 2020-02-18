import { scene, dynamicObjects, loadingManager } from '../index2.js'
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
    
    var box = new THREE.Box3().setFromObject( character );
    let test = box.getSize(new THREE.Vector3())
    console.log(test);
    bbox = new Ammo.btBoxShape( new Ammo.btVector3( test.x, test.y, test.z ) );
    bbox.setMargin( 0.05 );
    console.log(bbox)
    character.position.copy(pos)
    character.name = name
    var mass = 3 * 5;
    var localInertia = new Ammo.btVector3( 0, 0, 0 );
    bbox.calculateLocalInertia( mass, localInertia );
    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    var motionState = new Ammo.btDefaultMotionState( transform );
    var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, bbox, localInertia );
    var body = new Ammo.btRigidBody( rbInfo );
    character.userData.physicsBody = body
    dynamicObjects.push( character )
    scene.add(character)
    //physicsWorld.addRigidBody( body );
    console.log(physicsWorld, scene)

}

function progress(){
	
}
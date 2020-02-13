import { scene } from '../index2.js'
export function modelLoader( path, pos, name ){
	const loader = new THREE.GLTFLoader();
	loader.load(path, 
	(model) => onLoad(model, pos, name),
	() => progress(),
	(error) => console.log(error))
}

function onLoad( model, pos, name ){
    const character = model.scene
    character.scale.set(0.01, 0.01, 0.01)
    character.position.copy(pos)
    character.name = name
    scene.add(character)
    // console.log(pika)

}

function progress(){
	
}
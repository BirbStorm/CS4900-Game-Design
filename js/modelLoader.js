import { scene } from './index2.js'
export function modelLoader( path, pos, name ){
	const loader = new THREE.GLTFLoader();
	loader.load(path, 
	(model) => onLoad(model, pos, name),
	() => progress(),
	(error) => console.log(error))
}

function onLoad( model, pos, name ){
    const pokemon = model.scene
    pokemon.position.copy(pos)
    pokemon.name = name
    scene.add(pokemon)
    // console.log(pika)

}

function progress(){
	
}
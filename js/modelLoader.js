export function modelLoader( path, pos ){
	const loader = new THREE.GLTFLoader();
	loader.load(path, 
	(model) => onLoad(model, pos),
	() => progress(),
	(error) => console.log(error))
}

function onLoad( model, pos ){
	(model, pos = new THREE.Vector3(0,0,0)) => {
    const pika = model.scene
    pika.position.copy(pos)
    scene.add(pika)
    pika.name = "pika"
    console.log(pika)
  },
}

function progress(){
	
}
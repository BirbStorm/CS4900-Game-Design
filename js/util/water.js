export function Water(flowMap, waterGeometry){
    water = new THREE.Water( waterGeometry, {
        scale: 2,
        textureWidth: 1024,
        textureHeight: 1024,
        flowMap: flowMap
    } );
    water.position.y = 1;
    water.rotation.x = Math.PI * - 0.5;
            
    var helperGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
	var helperMaterial = new THREE.MeshBasicMaterial( { map: flowMap } );
	var helper = new THREE.Mesh( helperGeometry, helperMaterial );
	helper.position.y = 1.01;
	helper.rotation.x = Math.PI * - 0.5;
	helper.visible = false;
    return water, helper;
}

export function Terrain() {

    let xS = 63, yS = 63;

    //let mntTexture = new THREE.TextureLoader().load('../assets/textures/grass.jpg');
    //mntTexture.wrapS = mntTexture.wrapT = THREE.RepeatWrapping;
    //mntTexture.repeat.set(8,8);
	let t1 = new THREE.TextureLoader().load('../assets/textures/testWater.jpg');
	let t2 = new THREE.TextureLoader().load('../assets/textures/testSand.jpg');
	let t3 = new THREE.TextureLoader().load('../assets/textures/testGrass.jpg');
	let t4 = new THREE.TextureLoader().load('../assets/textures/testRock.jpg');
	
	var material = THREE.Terrain.generateBlendedMaterial([
    // The first texture is the base; other textures are blended in on top.
    {texture: t1},
    // Start blending in at height -80; opaque between -35 and 20; blend out by 50
    {texture: t2, levels: [-80, -35, 20, 50]},
    {texture: t3, levels: [20, 50, 60, 85]},
    // How quickly this texture is blended in depends on its x-position.
    {texture: t4, glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
    // Use this texture if the slope is between 27 and 45 degrees
    {texture: t3, glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'},
	]);
	
    let terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 3.5,
        heightmap: THREE.Terrain.HillIsland,
        material: new THREE.MeshBasicMaterial({map:mntTexture,side: THREE.DoubleSide}),
        maxHeight: 100,
        minHeight: -10,
        steps: 1,
        useBufferGeometry: false,
        xSegments: xS,
        xSize: 2048,
        ySegments: yS,
        ySize: 2048,
    });
    // Assuming you already have your global scene, add the terrain to it

    // Optional:
    // Get the geometry of the terrain across which you want to scatter meshes
    var geo = terrainScene.children[0].geometry;
    // Add randomly distributed foliage
    let decoScene = THREE.Terrain.ScatterMeshes(geo, {
        mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
        w: xS,
        h: yS,
        spread: 0.02,
        randomness: Math.random,
    });
    terrainScene.add(decoScene);
    var test = THREE.Terrain.toHeightmap(
        // terrainScene.children[0] is the most detailed version of the terrain mesh
        terrainScene.children[0].geometry.vertices,
        { xSegments: 63, ySegments: 63 }
    );
    let data = terrainScene.children[0].geometry
    console.log(THREE.Terrain.heightmapArray(THREE.Terrain.HillIsland,{
        easing: THREE.Terrain.Linear,
        frequency: 3.5,
        material: new THREE.MeshBasicMaterial({map:mntTexture,side: THREE.DoubleSide}),
        maxHeight: 100,
        minHeight: -10,
        steps: 1,
        useBufferGeometry: false,
        xSegments: xS,
        xSize: 2048,
        ySegments: yS,
        ySize: 2048
    }))
    console.log(terrainScene.children[0].geometry.vertices)
    return terrainScene
}
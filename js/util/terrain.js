
export function Terrain() {

    let xS = 63, yS = 63;

    let mntTexture = new THREE.TextureLoader().load('../assets/textures/grass.jpg');
    mntTexture.wrapS = mntTexture.wrapT = THREE.RepeatWrapping;
    mntTexture.repeat.set(8,8);
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
    console.log(data)
    return terrainScene
}
export function Terrain() {

    let xS = 63, yS = 63;
    let terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 3.5,
        heightmap: THREE.Terrain.HillIsland,
        material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
        maxHeight: 1000,
        minHeight: -100,
        steps: 1,
        useBufferGeometry: false,
        xSegments: xS,
        xSize: 8192,
        ySegments: yS,
        ySize: 8192,
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

    return terrainScene
}
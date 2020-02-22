
export function Terrain() {

    let xS = 63, yS = 63;

    //let mntTexture = new THREE.TextureLoader().load('../assets/textures/grass.jpg');
    //mntTexture.wrapS = mntTexture.wrapT = THREE.RepeatWrapping;
    //mntTexture.repeat.set(8,8);
	//let t1 = new THREE.TextureLoader().load('../assets/textures/testWater.jpg');
	let t1 = new THREE.TextureLoader().load('../assets/textures/testSand.jpg');
	let t2 = new THREE.TextureLoader().load('../assets/textures/testGrass.jpg');
	let t3 = new THREE.TextureLoader().load('../assets/textures/testRock.jpg');
	
	let material = THREE.Terrain.generateBlendedMaterial([
    // The first texture is the base; other textures are blended in on top.
    {texture: t1, levels: [-10, -5, ,15 , 25]},
    // Start blending in at height -80; opaque between -35 and 20; blend out by 50
    {texture: t2, levels: [5, 10, 45, 60]},
    {texture: t3, levels: [30, 50, 100, 100]},

    // How quickly this texture is blended in depends on its x-position.
    //{texture: t4, glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
    // Use this texture if the slope is between 27 and 45 degrees
    //{texture: t3, glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'},
	]);
	
    let terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 3.5,
        heightmap: THREE.Terrain.HillIsland,
        material: material,
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
    let geo = terrainScene.children[0].geometry;
    // Add randomly distributed foliage
    let decoScene = THREE.Terrain.ScatterMeshes(geo, {
        mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
        w: xS,
        h: yS,
        spread: 0.02,
        randomness: Math.random,
    });
    terrainScene.add(decoScene);
    let test = THREE.Terrain.toHeightmap(
        // terrainScene.children[0] is the most detailed version of the terrain mesh
        terrainScene.children[0].geometry.vertices,
        { xSegments: 63, ySegments: 63 }
    );
    let data = terrainScene.children[0].geometry
    console.log(THREE.Terrain.heightmapArray(THREE.Terrain.HillIsland,{
        easing: THREE.Terrain.Linear,
        frequency: 3.5,
        material: new THREE.MeshBasicMaterial({map:material,side: THREE.DoubleSide}),
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

var gridWidth , gridHeight;
var displacement 
export var positions

var getIndex = (x, y, h) => y*h + x


export function generateTerrain(){
    gridHeight = 1024
    gridWidth = 1024
    displacement = new Float32Array(gridWidth*gridHeight);
    for(let i in displacement)
        displacement[i] = 0;

    computeDisplacement()


    let geometry, wireframegeometry;
    geometry = new THREE.PlaneBufferGeometry(gridWidth, gridHeight, gridWidth-1, gridHeight-1);
    let t2 = new THREE.TextureLoader().load('../assets/textures/grass.jpg' );
    t2.wrapS = t2.wrapT = THREE.RepeatWrapping;
    t2.repeat.set(8,8)
    positions = geometry.attributes.position.array;

    let i1 = 0
    for(let i = 2; i<positions.length; i+=3) {
        positions[i] -= displacement[i1]; 
        i1++;
    }
    let material = new THREE.MeshLambertMaterial( { map:t2 } );
    let mesh = new THREE.Mesh( geometry, material);

    mesh.rotation.x = -90*3.14/180.0;
    
    console.log(mesh)
    
    return mesh
}

function computeDisplacement() {
    
    let maxScale = 10;
    for (let scale = 2; scale <= maxScale; scale++){
        // create image data
        let origImage = new Float32Array(scale**3 *scale+1);
        // populate it w random noise
        for(let i in origImage)
            origImage[i] = (Math.random()*1000)/Math.pow(scale, 2.5); 

        // create resized image
        let resizedImage = new Float32Array(gridWidth*gridHeight); 
        for (let i = 0; i<gridWidth*gridHeight; i++) 
            resizedImage[i]  = 0;

        // upsample via bilinear interpolation
        for (let x = 0; x<gridWidth; x++) 
            for(let y = 0; y<gridHeight; y++) 
            {
                //interpolate along the x direction
                let realX = x / gridWidth * (scale**2);
                let realY = y / gridHeight * (scale**2);

                let x_left = Math.floor(realX);
                let y_up = Math.floor(realY);
                let x_right = Math.ceil(realX);
                let y_down = Math.ceil(realY);
                
                let right_influence = Math.abs(realX - x_left);
                let left_influence = Math.abs(realX - x_right)==0 ? 1 : Math.abs(realX - x_right);;
                
                let up_influence = Math.abs(realY - y_up);
                let down_influence = Math.abs(realY - y_down)==0  ? 1 : Math.abs(realY - y_down);;

                
                let inputIndexLeft = getIndex(x_left, y_up, scale**2);
                let inputIndexRight = getIndex(x_right, y_up, scale**2);
                let origValueLeft = origImage[inputIndexLeft];
                let origValueRight = origImage[inputIndexRight];
                let lrInterpUp = left_influence*origValueLeft + right_influence*origValueRight;

                inputIndexLeft = getIndex(x_left, y_down, scale**2);
                inputIndexRight = getIndex(x_right, y_down, scale**2);
                origValueLeft = origImage[inputIndexLeft];

                if(!origValueLeft) {
                    inputIndexLeft = getIndex(x_left, y_up, scale**2);
                    inputIndexRight = getIndex(x_right, y_up, scale**2);
                    origValueLeft = origImage[inputIndexLeft];
                }
                origValueRight = origImage[inputIndexRight];
                if(!origValueRight) { 
                    inputIndexLeft = getIndex(x_left, y_up, scale**2);
                    inputIndexRight = getIndex(x_right, y_up, scale**2);
                    origValueRight = origImage[inputIndexRight];

                }
                let lrInterpDown = left_influence*origValueLeft + right_influence*origValueRight;


                let lrInterpBoth = down_influence*lrInterpUp + up_influence*lrInterpDown;

                let outIndex = getIndex(x, y, gridHeight);
                resizedImage[outIndex] = lrInterpBoth; 

                displacement[outIndex] += resizedImage[outIndex];
            }

    }			

    let accum = -40;
    for(let i in displacement)
        accum += displacement[i];
    let mean = accum / displacement.length;

    for(let i in displacement)
        if(displacement[i] > mean) 
            displacement[i] = mean;
    
}

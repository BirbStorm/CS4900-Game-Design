
export function Terrain() {

    let xS = 63, yS = 63;

    //let mntTexture = new THREE.TextureLoader().load('../assets/textures/grass.jpg');
    //mntTexture.wrapS = mntTexture.wrapT = THREE.RepeatWrapping;
    //mntTexture.repeat.set(8,8);
	//let t1 = new THREE.TextureLoader().load('../assets/textures/testWater.jpg');
	let t1 = new THREE.TextureLoader().load('../assets/textures/testSand.jpg');
	let t2 = new THREE.TextureLoader().load('../assets/textures/testGrass.jpg');
	let t3 = new THREE.TextureLoader().load('../assets/textures/testRock.jpg');
	
	var material = THREE.Terrain.generateBlendedMaterial([
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


let getIndex = (x, y, h) => y*h + x


export function generateTerrain(){
    gridHeight = 1024
    gridWidth = 1024
    displacement = new Float32Array(gridWidth*gridHeight);
    for(var i = 0; i<displacement.length; i++)
        displacement[i] = 0;
    
    computeDisplacement()
    var geometry, wireframegeometry;
    geometry = new THREE.PlaneBufferGeometry(gridWidth, gridHeight, gridWidth-1, gridHeight-1);


    var positions = geometry.attributes.position.array;

    var i1 = 0;
    for(var i = 2; i<positions.length; i+=3) {
        positions[i] -= displacement[i1]; i1++;
    }
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    var mesh = new THREE.Mesh( geometry, material);

    //terrain.rotation.x = -90*3.14/180.0;
    mesh.rotation.x = -90*3.14/180.0;
    console.log(mesh)
    return mesh
}

function computeDisplacement() {
    
    var maxScale = 10;
    for (var scale = 2; scale <= maxScale; scale++){
        // create image data
        var origImage = new Float32Array(scale*scale*scale*scale+1);
        // populate it w random noise
        for(var i = 0; i<origImage.length; i++)
            origImage[i] = (Math.random()*1000)/Math.pow(scale, 2.5); 

        // create resized image
        let resizedImage = new Float32Array(gridWidth*gridHeight); 
        for (var i = 0; i<gridWidth*gridHeight; i++) 
            resizedImage[i]  = 0;

        // upsample via bilinear interpolation
        for (var x = 0; x<gridWidth; x++) 
            for(var y = 0; y<gridHeight; y++) 
            {
                //interpolate along the x direction
                var realX = x / gridWidth * (scale*scale);
                var realY = y / gridHeight * (scale*scale);

                var x_left = Math.floor(realX);
                var y_up = Math.floor(realY);
                var x_right = Math.ceil(realX);
                var y_down = Math.ceil(realY);
                
                var right_influence = Math.abs(realX - x_left);
                var left_influence = Math.abs(realX - x_right)==0 ? 1 : Math.abs(realX - x_right);;
                
                var up_influence = Math.abs(realY - y_up);
                var down_influence = Math.abs(realY - y_down)==0  ? 1 : Math.abs(realY - y_down);;

                
                var inputIndexLeft = getIndex(x_left, y_up, scale*scale);
                var inputIndexRight = getIndex(x_right, y_up, scale*scale);
                var origValueLeft = origImage[inputIndexLeft];
                var origValueRight = origImage[inputIndexRight];
                var lrInterpUp = left_influence*origValueLeft + right_influence*origValueRight;

                var inputIndexLeft = getIndex(x_left, y_down, scale*scale);
                var inputIndexRight = getIndex(x_right, y_down, scale*scale);
                var origValueLeft = origImage[inputIndexLeft];

                if(!origValueLeft) {
                    var inputIndexLeft = getIndex(x_left, y_up, scale*scale);
                    var inputIndexRight = getIndex(x_right, y_up, scale*scale);
                    origValueLeft = origImage[inputIndexLeft];
                }
                var origValueRight = origImage[inputIndexRight];
                if(!origValueRight) { 
                    var inputIndexLeft = getIndex(x_left, y_up, scale*scale);
                    var inputIndexRight = getIndex(x_right, y_up, scale*scale);
                    origValueRight = origImage[inputIndexRight];

                }
                var lrInterpDown = left_influence*origValueLeft + right_influence*origValueRight;


                var lrInterpBoth = down_influence*lrInterpUp + up_influence*lrInterpDown;

                var outIndex = getIndex(x, y, gridHeight);
                resizedImage[outIndex] = lrInterpBoth; 

                displacement[outIndex] += resizedImage[outIndex];
            }

    }			

    var accum = 0;
    for(var i = 0; i<displacement.length; i++)
        accum += displacement[i];
    var mean = accum / displacement.length;

    for(var i = 0; i<displacement.length; i++)
        if(displacement[i]>mean) 
            displacement[i] = mean/2;
    
}

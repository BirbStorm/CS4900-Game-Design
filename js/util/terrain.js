
var gridWidth , gridHeight;
var displacement 
var positions
export let heightMap = []
export let max, min;
var getIndex = (x, y, h) => y*h + x


export function generateTerrain(){
    gridHeight = 1024
    gridWidth = 1024
    displacement = new Float32Array(gridWidth*gridHeight);
    for(let i in displacement)
        displacement[i] = 0;

    computeDisplacement()

    let t1 = new THREE.TextureLoader().load('../assets/textures/testSand.jpg');
	let t2 = new THREE.TextureLoader().load('../assets/textures/testGrass.jpg');
	let t3 = new THREE.TextureLoader().load('../assets/textures/testRock.jpg');
	
	var material = THREE.Terrain.generateBlendedMaterial([
    {texture: t1},
    {texture: t2, levels: [100, 115, 130,150]},
    {texture: t3, levels: [130, 150, 180, 200]},
    ]);
    
    let geometry, wireframegeometry;
    geometry = new THREE.PlaneBufferGeometry(gridWidth, gridHeight, gridWidth-1, gridHeight-1);

    positions = geometry.attributes.position.array;
    console.log(geometry.faces)
    let i1 = 0
    for(let i = 2; i<positions.length; i+=3) {
        positions[i] -= displacement[i1];
        heightMap[i1] = Math.abs(positions[i] )
        positions[i] = Math.abs(positions[i] )
        i1++;
    }


    geometry.computeFaceNormals();



    let mesh = new THREE.Mesh( geometry, material);

    mesh.rotation.x = -90*3.14/180.0;
    
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

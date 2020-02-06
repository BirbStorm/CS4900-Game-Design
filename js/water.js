export function Water(){
    let waterTexture = new THREE.TextureLoader().load('../assets/textures/waterpic.jpg');
    waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(16,16)
    
    let waterMaterial = new THREE.MeshBasicMaterial({map: waterTexture, side: THREE.DoubleSide});
    let waterGeometry = new THREE.PlaneGeometry(8192, 8192, 10, 10);
    let water = new THREE.Mesh(waterGeometry, waterMaterial);

    return water;
}
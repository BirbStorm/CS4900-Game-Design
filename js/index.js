
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,1000);
 
var renderer = new THREE.WebGLRenderer();
renderer.setSize (window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
 
var geometry = new THREE.SphereGeometry(9, 12, 12);
var material = new THREE.MeshBasicMaterial ({color: 0x0011ff});
var sphere = new THREE.Mesh(geometry, wireframe);
var wireframe = new THREE.WireframeGeometry( geometry );
 
var line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;
 
scene.add( line );
 
camera.position.z= 35;
//camera.position.x= 10;
 
var a = 0.01;

function render(){
  requestAnimationFrame (render);

	var m1 = new THREE.Matrix4();
	var m2 = new THREE.Matrix4();

	var T = new THREE.Matrix4();

	m1.makeRotationX(a); 
	m2.makeRotationZ(a+0.01);

	T = m2.multiply(m1);
	
	
	line.applyMatrix(T);
	
	

  renderer.render (scene, camera);
}


render();

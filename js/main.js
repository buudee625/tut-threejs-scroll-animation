import '../css/index.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// three.js always need the following three objects:
// 1. Scene (a container that holds all lights and cameras)
// 2. Camera
// 3. Renderer
// ===============================================

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// PerspectiveCamera args:(
// field of view (amount of world that is visible),
// aspect ratio (base on client's browser window),
// view frustum (control what's visible base on camera's pov, start and end)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
// render = draw
// WebGLRenderer needs to know which DOM element to use

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // setting canvas size
// camera.position.setZ(5); // position the camera

renderer.render(scene, camera); // render (draw) the graphics
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight); // setting canvas size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Creating the 3D object
// ===============================================
// 1) Create the 3D shape, refer to https://threejs.org/docs/#api/en/geometries/TorusGeometry
const geometry = new THREE.TorusGeometry(10, 1, 10, 40);

// 2) Create a material, which is like the wrapping paper of the geometry shape
// Most material requires light source but basic material does not
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff6347,
//   wireframe: true,
// });

// Standard materail will react to light so it will not be visible if no light source is given
// Refer to https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
const material = new THREE.MeshStandardMaterial({ color: 0xffc864 });

// Creating a light source, refer to https://threejs.org/docs/#api/en/lights/PointLight
const pointLight = new THREE.PointLight(0xffffff, 0.75, 50); // This is a point light with white light
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(0, 20, 0);
scene.add(pointLight, ambientLight);

// 3) Declare the shape by combining the geometry and the material and then add it to the scene
const torus = new THREE.Mesh(geometry, material); // mesh = geometry + material
scene.add(torus);

// Helpers
// ===============================================
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// OrbitControl Helper
// ===============================================
// const OrbControl = new OrbitControls(camera, renderer.domElement);

// Adding stars
// ===============================================
const geoStar = new THREE.SphereGeometry(0.25, 24, 24);
const matStar = new THREE.MeshStandardMaterial({ color: 0xffffff });
function addStar() {
  const star = new THREE.Mesh(geoStar, matStar);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100)); // Randomly generate numbers between 100, -100 for the position values
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar); // Generate 200 stars

// Add background texture
// ===============================================
const bgTexture = new THREE.TextureLoader().load('/img/space.jpg');
scene.background = bgTexture;

// Add a cube and use Texture Mapping
// ===============================================
const avatarTexture = new THREE.TextureLoader().load('/img/me.png');
const avatarCube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);
scene.add(avatarCube);

// Add a moon by combining texture maps
// ===============================================
const moonTexture = new THREE.TextureLoader().load('img/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('img/normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.x = 5;
moon.position.y = 3;
moon.position.z = -7;

// Move the camera as users scroll
// ===============================================
function moveCamera() {
  const t = document.body.getBoundingClientRect().top - 1;
  // console.log(t);
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatarCube.rotation.y += 0.01;
  avatarCube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

// Assign the func in the eventlistener that listens to onscroll events
document.body.onscroll = moveCamera;

// Set up a recursive function to call for render so we don't have to repeatedly call render
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;
  // OrbControl.update();
  renderer.render(scene, camera);
}
animate();

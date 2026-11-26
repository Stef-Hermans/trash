import * as THREE from "three";
import "./style.css";

const container = document.querySelector("#scene");

if (!container) {
  throw new Error("Scene container not found");
}

const scene = new THREE.Scene();
const fogColor = new THREE.Color("#111827");
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 8, 40);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(3, 2.5, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(4, 5, 3);
scene.add(keyLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: "#166534", roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.3;
scene.add(ground);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: "#22c55e", roughness: 0.4 }),
);
scene.add(cube);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

function animate() {
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.008;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

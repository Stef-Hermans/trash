import * as THREE from "three";
import { createKeyboardControls } from "./controls.js";
import { createFollowCamera } from "./followCamera.js";
import { createScene } from "./scene.js";
import { createVan } from "./van.js";
import "./style.css";

const container = document.querySelector("#scene");

if (!container) {
  throw new Error("Scene container not found");
}

const world = createScene();
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1500,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const van = createVan(world.scene, world.groundY);
const controls = createKeyboardControls();
const followCamera = createFollowCamera(camera, van.object);

void van.ready.catch((error) => {
  console.error("Failed to load /models/van.glb.", error);
});

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

let previousFrameTime = 0;

function animate(time) {
  const delta = Math.min((time - previousFrameTime) / 1000, 0.05);
  previousFrameTime = time;

  van.update(delta, controls.readInput());
  followCamera.update(delta);
  renderer.render(world.scene, camera);
}

renderer.setAnimationLoop(animate);

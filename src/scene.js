import * as THREE from "three";

const GROUND_Y = -1.3;
const ROAD_LENGTH = 2000;

function createSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create the sky gradient.");
  }

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#367bb7");
  gradient.addColorStop(0.58, "#83c9e8");
  gradient.addColorStop(0.9, "#dce8df");
  gradient.addColorStop(1, "#e5dfc5");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

function addRoad(scene) {
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(12, ROAD_LENGTH),
    new THREE.MeshStandardMaterial({ color: "#343a40", roughness: 1 }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, GROUND_Y + 0.01, 0);
  scene.add(road);

  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#f8fafc" });
  const edgeGeometry = new THREE.BoxGeometry(0.16, 0.025, ROAD_LENGTH);
  for (const x of [-5.6, 5.6]) {
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.position.set(x, GROUND_Y + 0.035, 0);
    scene.add(edge);
  }

  const dashCount = 251;
  const dashes = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.18, 0.025, 4),
    edgeMaterial,
    dashCount,
  );
  const marker = new THREE.Object3D();

  for (let index = 0; index < dashCount; index += 1) {
    marker.position.set(0, GROUND_Y + 0.035, -1000 + index * 8);
    marker.updateMatrix();
    dashes.setMatrixAt(index, marker.matrix);
  }

  dashes.instanceMatrix.needsUpdate = true;
  scene.add(dashes);
}

function addRoadsideMarkers(scene) {
  const markerCount = 122;
  const markers = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.28, 1.4, 0.28),
    new THREE.MeshStandardMaterial({ color: "#f1f5f9" }),
    markerCount,
  );
  const marker = new THREE.Object3D();
  let index = 0;

  for (let z = -600; z <= 600; z += 20) {
    for (const side of [-1, 1]) {
      marker.position.set(side * 7.5, GROUND_Y + 0.7, z);
      marker.updateMatrix();
      markers.setMatrixAt(index, marker.matrix);
      index += 1;
    }
  }

  markers.instanceMatrix.needsUpdate = true;
  scene.add(markers);
}

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = createSkyTexture();
  scene.fog = new THREE.Fog("#dce4d8", 100, 500);

  scene.add(new THREE.HemisphereLight("#eaf7ff", "#526b3e", 1.8));

  const sunlight = new THREE.DirectionalLight("#fff4d6", 2.5);
  sunlight.position.set(-30, 45, -20);
  scene.add(sunlight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshStandardMaterial({ color: "#5b914b", roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  scene.add(ground);

  addRoad(scene);
  addRoadsideMarkers(scene);

  return { scene, groundY: GROUND_Y };
}

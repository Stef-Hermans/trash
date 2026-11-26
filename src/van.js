import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MAX_SPEED = 8;
const MAX_REVERSE_SPEED = 3;
const ACCELERATION = 5;
const COASTING_DECELERATION = 4;
const STEERING_RATE = 2;

export function createVan(scene, groundY) {
  const object = new THREE.Group();
  const direction = new THREE.Vector3();
  let speed = 0;
  scene.add(object);

  const ready = new GLTFLoader().loadAsync("/models/van.glb").then((gltf) => {
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const footprint = Math.max(size.x, size.z);

    if (!Number.isFinite(footprint) || footprint <= 0) {
      throw new Error("The van model has no measurable size.");
    }

    model.scale.setScalar(2.4 / footprint);
    const scaledBounds = new THREE.Box3().setFromObject(model);
    model.position.y += groundY - scaledBounds.min.y;
    object.add(model);
  });

  return {
    object,
    ready,
    update(delta, input) {
      if (input.throttle === 0) {
        const deceleration = COASTING_DECELERATION * delta;
        speed =
          Math.abs(speed) <= deceleration
            ? 0
            : speed - Math.sign(speed) * deceleration;
      } else {
        speed = THREE.MathUtils.clamp(
          speed + input.throttle * ACCELERATION * delta,
          -MAX_REVERSE_SPEED,
          MAX_SPEED,
        );
      }

      if (input.steering !== 0 && Math.abs(speed) > 0.05) {
        const steeringFactor = Math.min(Math.abs(speed) / MAX_SPEED, 1);
        // The chase camera looks along +Z, reversing screen-space steering.
        object.rotation.y -=
          input.steering *
          STEERING_RATE *
          steeringFactor *
          Math.sign(speed) *
          delta;
      }

      direction.set(
        Math.sin(object.rotation.y),
        0,
        Math.cos(object.rotation.y),
      );
      object.position.addScaledVector(direction, speed * delta);
    },
  };
}

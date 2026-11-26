import * as THREE from "three";

export function createFollowCamera(camera, target) {
  const cameraTarget = new THREE.Vector3(0, 1, 0);
  const cameraOffset = new THREE.Vector3(0, 4.2, -8.5);
  const lookOffset = new THREE.Vector3(0, 1, 1.5);
  const desiredPosition = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();

  camera.position.copy(cameraOffset);
  camera.lookAt(cameraTarget);

  return {
    update(delta) {
      desiredPosition
        .copy(cameraOffset)
        .applyQuaternion(target.quaternion)
        .add(target.position);
      desiredTarget
        .copy(lookOffset)
        .applyQuaternion(target.quaternion)
        .add(target.position);

      const followAmount = 1 - Math.exp(-4 * delta);
      camera.position.lerp(desiredPosition, followAmount);
      cameraTarget.lerp(desiredTarget, followAmount);
      camera.lookAt(cameraTarget);
    },
  };
}

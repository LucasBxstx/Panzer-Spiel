import * as THREE from 'three';

export function setupCamera(canvas: HTMLCanvasElement) {
  const camera = new THREE.PerspectiveCamera(
    50,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  );

  // camera.position.set(30, 10, 50);
  camera.position.set(0, 70, 85);
  camera.lookAt(0, 0, 0);

  return camera;
}

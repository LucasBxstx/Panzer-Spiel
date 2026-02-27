import * as THREE from 'three';
import { Position } from '../../shared/models/vector.model';

export function setupCamera(canvas: HTMLCanvasElement, cameraPosition?: Position) {
  const camera = new THREE.PerspectiveCamera(
    50,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  );

  // camera.position.set(0, 30, -50);
  if (cameraPosition) {
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  } else {
    camera.position.set(0, 70, 85);
  }
  camera.lookAt(0, 0, 0);

  return camera;
}

import * as THREE from 'three';
import { Scene } from 'three';

export function addLight(scene: Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(70, 80, 70);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 300;
  directionalLight.shadow.camera.left = -150;
  directionalLight.shadow.camera.right = 150;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -50;
  scene.add(directionalLight);

  // const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  // backLight.position.set(-10, 10, -10);
  // scene.add(backLight);
}

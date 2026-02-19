import * as THREE from 'three';
import { Scene } from 'three';
import { ObstacleResponse } from '../../shared/models/obstacle.model';
import { loadTexture } from './load-texture';

export function createObstacleWithTexture(scene: Scene, obstacle: ObstacleResponse): void {
  if (!obstacle.texture) {
    return;
  }

  const { diffuse, normal, roughness } = loadTexture(obstacle.texture);
  const s = obstacle.scale;
  const geometry = new THREE.BoxGeometry(s.x, s.y, s.z);

  const material = new THREE.MeshStandardMaterial({
    map: diffuse,
    normalMap: normal,
    roughnessMap: roughness,
    roughness: 1.0,
    metalness: 0.0,
  });

  const cube = new THREE.Mesh(geometry, material);
  const p = obstacle.position;
  cube.position.set(p.x, p.y, p.z);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
}

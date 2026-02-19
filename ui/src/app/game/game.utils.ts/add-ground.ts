import * as THREE from 'three';
import { Scene } from 'three';
import { GameMapResponse } from '../../shared/models/game-map.model';
import { loadTexture } from './load-texture';

export function addGround(scene: Scene, map: GameMapResponse) {
  const { diffuse, normal, roughness } = loadTexture(map.groundTexture);

  const groundGeometry = new THREE.PlaneGeometry(100, 100, 64, 64);

  const groundMaterial = new THREE.MeshStandardMaterial({
    map: diffuse,
    normalMap: normal,
    roughnessMap: roughness,
    roughness: 3.0,
    metalness: 0.2,
  });

  const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
  groundPlane.rotation.x = -Math.PI / 2;
  groundPlane.receiveShadow = true;
  scene.add(groundPlane);
}

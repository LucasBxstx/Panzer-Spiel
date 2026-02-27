import * as THREE from 'three';
import { Scene } from 'three';
import { GameMapResponse } from '../../shared/models/game-map.model';

export function addGround(scene: Scene, map: GameMapResponse) {
  const groundGeometry = new THREE.PlaneGeometry(150, 150, 64, 64);

  const groundMaterial = new THREE.MeshStandardMaterial({
    roughness: 3.0,
    metalness: 0.2,
  });

  const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
  groundPlane.rotation.x = -Math.PI / 2;
  groundPlane.receiveShadow = true;
  groundPlane.castShadow = false;
  scene.add(groundPlane);

  // Texturen einzeln laden mit onLoad-Callback
  const textureLoader = new THREE.TextureLoader();

  textureLoader.load(map.groundTexture.diffuseImageUrl, (diffuse) => {
    diffuse.colorSpace = THREE.SRGBColorSpace;
    diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
    groundMaterial.map = diffuse;
    groundMaterial.needsUpdate = true;
  });

  textureLoader.load(map.groundTexture.normalImageUrl, (normal) => {
    normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
    groundMaterial.normalMap = normal;
    groundMaterial.needsUpdate = true;
  });

  textureLoader.load(map.groundTexture.roughnessImageUrl, (roughness) => {
    roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;
    groundMaterial.roughnessMap = roughness;
    groundMaterial.needsUpdate = true;
  });
}

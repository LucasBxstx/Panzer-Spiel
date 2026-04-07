import * as THREE from 'three';
import { Scene } from 'three';
import { GameMapResponse } from '../../shared/models/game-map.model';

const CHUNK_SIZE = 5;

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

  //addChunkGrid(scene, map.scale.x);
}

function addChunkGrid(scene: Scene, MAP_SIZE: number = 110) {
  const chunksPerAxis = Math.ceil(MAP_SIZE / CHUNK_SIZE);
  const halfMap = MAP_SIZE / 2;

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    depthTest: true,
  });

  for (let cx = 0; cx < chunksPerAxis; cx++) {
    for (let cz = 0; cz < chunksPerAxis; cz++) {
      const x0 = -halfMap + cx * CHUNK_SIZE;
      const z0 = -halfMap + cz * CHUNK_SIZE;
      const x1 = x0 + CHUNK_SIZE;
      const z1 = z0 + CHUNK_SIZE;
      const y = 0.05;

      const points = [
        new THREE.Vector3(x0, y, z0),
        new THREE.Vector3(x1, y, z0),
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x0, y, z1),
        new THREE.Vector3(x0, y, z0),
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const border = new THREE.Line(geometry, lineMaterial);
      border.renderOrder = 1;
      scene.add(border);
    }
  }
}

import * as THREE from 'three';
import { Scene } from 'three';
import { ObstacleResponse } from '../../shared/models/obstacle.model';
import { loadTexture } from './load-texture';
import { GLTF, GLTFLoader } from 'three-stdlib';

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
  const r = obstacle.rotation;
  cube.position.set(p.x, p.y, p.z);
  cube.rotation.set(r.x, r.y, r.z);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
}

export function createObstacleWithModel(
  scene: THREE.Scene,
  obstacle: ObstacleResponse,
): Promise<THREE.Object3D> | undefined {
  if (!obstacle.modelUrl) return;
  console.log(obstacle);

  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      obstacle.modelUrl!,
      // 'assets/models/desert_mesa.glb',
      (gltf: GLTF) => {
        const newObstacle = gltf.scene;

        newObstacle.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            console.log('mesh found:', child.name, 'material:', child.material); // material ok?
          }
        });

        const { x: sx, y: sy, z: sz } = obstacle.renderScale;
        const { x: px, y: py, z: pz } = obstacle.position;
        const { x: rx, y: ry, z: rz } = obstacle.rotation;

        newObstacle.scale.set(sx, sy, sz);
        newObstacle.position.set(px, py, pz);
        newObstacle.rotation.set(rx, ry, rz);

        // newObstacle.scale.set(20, 20, 20);
        // newObstacle.position.set(50, 6, 0);
        // newObstacle.rotation.set(0, 0.3 * Math.PI, 0);

        scene.add(newObstacle);
        resolve(newObstacle);
      },
      (progress) => {
        // console.log(
        //   'Loading progress obstacle model: ',
        //   obstacle.name,
        //   ' ',
        //   (progress.loaded / progress.total) * 100 + '%',
        // );
      },
      (error) => {
        reject(error);
      },
    );
  });
}

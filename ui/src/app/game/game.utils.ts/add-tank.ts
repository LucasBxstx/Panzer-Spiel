import { GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Scene } from 'three';
import { TankResponse } from '../../shared/models/tank.model';

export function addTank(
  scene: Scene,
  tank: TankResponse,
): Promise<{
  tankGroup: THREE.Group;
  tankBody: THREE.Object3D;
  tankTurret: THREE.Object3D;
}> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      tank.modelUrl,
      (gltf: any) => {
        const tankGroup: THREE.Group = gltf.scene;

        const s = tank.renderScale;
        const p = tank.position;
        tankGroup.scale.set(s.x, s.y, s.z);
        tankGroup.rotation.set(0, tank.rotation, 0);
        tankGroup.position.set(p.x, p.y, p.z);

        tankGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const tankBody = tankGroup.getObjectByName('tank')!;
        const tankTurret = tankGroup.getObjectByName('turret')!;

        scene.add(tankGroup);

        resolve({ tankGroup, tankBody, tankTurret });
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        reject(error);
      },
    );
  });
}

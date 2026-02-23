import * as THREE from 'three';
import { Scene } from 'three';
import { TankGroup, TankResponse } from '../../shared/models/tank.model';
import { GLTF, GLTFLoader } from 'three-stdlib';

export function addTank(scene: Scene, tank: TankResponse, showHitbox: boolean): Promise<TankGroup> {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      tank.modelUrl,
      (gltf: GLTF) => {
        const tankGroup: THREE.Group = gltf.scene;
        const s = tank.scale;
        const rs = tank.renderScale;
        const p = tank.position;

        tankGroup.scale.set(rs.x, rs.y, rs.z);
        tankGroup.rotation.set(0, 0, 0);
        tankGroup.position.set(p.x, p.y, p.z);

        tankGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const modelTankBody = tankGroup.getObjectByName('tank')!;
        const modelTankTurret = tankGroup.getObjectByName('turret')!;

        const bodyGeometry = new THREE.BoxGeometry(s.x, s.y, s.z);
        const bodyMaterial = new THREE.MeshStandardMaterial({ visible: false });
        const tankBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        tankBody.rotation.set(0, tank.rotation, 0);

        tankBody.add(modelTankBody);
        tankGroup.add(tankBody);
        tankGroup.add(modelTankTurret);

        modelTankTurret.rotation.set(0, tank.turretRotation, 0);

        if (showHitbox) {
          const edges = new THREE.EdgesGeometry(bodyGeometry);
          const hitbox = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false }),
          );
          tankBody.add(hitbox);
        }

        scene.add(tankGroup);

        resolve({
          tankId: tank.id,
          tankGroup,
          tankBody,
          tankTurret: modelTankTurret,
        });
      },
      (progress) => {
        console.log('Loading progress tank model:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        reject(error);
      },
    );
  });
}

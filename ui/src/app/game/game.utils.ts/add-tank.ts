import * as THREE from 'three';
import { Scene } from 'three';
import { TankGroup, TankResponse } from '../../shared/models/tank.model';
import { CSS2DObject, GLTF, GLTFLoader } from 'three-stdlib';

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
            child.receiveShadow = false;
          }
        });

        const modelTankBody = tankGroup.getObjectByName('tank')!;
        const modelTankTurret = tankGroup.getObjectByName('turret')!;

        const bodyGeometry = new THREE.BoxGeometry(s.x / rs.x, s.y / rs.y, s.z / rs.z);
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
            new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: true }),
          );
          tankBody.add(hitbox);
        }

        scene.add(tankGroup);

        const labelDiv = document.createElement('div');
        labelDiv.textContent = tank.playerName;
        labelDiv.style.cssText = `
  color: ${tank.teamColor};
  font-size: 14px;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000,
     0    0   6px rgba(0,0,0,0.8);
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
  z-index: 1;
`;

        const label = new CSS2DObject(labelDiv);
        label.position.set(-1, s.y / rs.y + 1, 0);
        tankBody.add(label);

        resolve({
          tankId: tank.id,
          tankGroup,
          tankBody,
          tankTurret: modelTankTurret,
          nameLabel: label,
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

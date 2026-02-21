import { GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';
import { Scene } from 'three';
import { TankGroup, TankResponse } from '../../shared/models/tank.model';

export function addTank(scene: Scene, tank: TankResponse, showHitbox: boolean): Promise<TankGroup> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      tank.modelUrl,
      (gltf: any) => {
        const tankGroup: THREE.Group = gltf.scene;

        const s = tank.renderScale;
        const p = tank.position;
        tankGroup.scale.set(s.x, s.y, s.z);
        tankGroup.rotation.set(0, 0, 0);
        tankGroup.position.set(p.x, p.y, p.z);

        tankGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const tankBody = tankGroup.getObjectByName('tank')!;
        const tankTurret = tankGroup.getObjectByName('turret')!;

        tankBody.rotation.set(0, tank.rotation, 0);

        if (showHitbox) createHitboxHelper(tank, tankBody, tankGroup);

        scene.add(tankGroup);

        resolve({ tankId: tank.id, tankGroup, tankBody, tankTurret });
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

function createHitboxHelper(
  tank: TankResponse,
  tankBody: THREE.Object3D,
  tankGroup: THREE.Group,
): THREE.LineSegments {
  const s = tank.scale;

  const geometry = new THREE.BoxGeometry(s.x, s.y, s.z);
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    depthTest: true,
  });

  const hitbox = new THREE.LineSegments(edges, material);
  hitbox.renderOrder = 999;

  // Position relativ zu tankBody (nicht Weltkoordinaten)
  // tankBody's lokaler Ursprung → wir müssen die Mitte der tankGroup finden
  const box = new THREE.Box3().setFromObject(tankGroup);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // Von Weltkoordinaten in tankBody-lokale Koordinaten – OHNE worldToLocal
  hitbox.position.set(center.x - tankGroup.position.x, s.y / 2, center.z - tankGroup.position.z);

  // An tankBody hängen → erbt automatisch die Rotation
  tankBody.add(hitbox);

  return hitbox;
}

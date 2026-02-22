import * as THREE from 'three';
import { Scene } from 'three';
import { TankGroup, TankResponse } from '../../shared/models/tank.model';
import { TextureResponse } from '../../shared/models/texture.model';
import { GLTFLoader } from 'three-stdlib';

export function getStoneWallTexture(): TextureResponse {
  return {
    id: '2',
    name: 'Brick',
    diffuseImageUrl: 'assets/textures/old_stone_wall_diff_1k.jpg',
    normalImageUrl: 'assets/textures/old_stone_wall_nor_gl_1k.png',
    roughnessImageUrl: 'assets/textures/old_stone_wall_rough_1k.exr',
    repeat: { x: 20, y: 20 },
  };
}

// export function addTank(scene: Scene, tank: TankResponse, showHitbox: boolean): Promise<TankGroup> {
//   const s = tank.scale;
//   const p = tank.position;
//   const r = tank.rotation;
//
//   // Body
//   const bodyGeometry = new THREE.BoxGeometry(s.x, s.y, s.z);
//   const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c59 });
//   const tankBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
//   tankBody.castShadow = true;
//   tankBody.receiveShadow = true;
//
//   // Turret: doppelt so lang (z), halb so breit (x)
//   const turretGeometry = new THREE.BoxGeometry(s.x / 2, s.y / 2, s.z * 2);
//   const turretMaterial = new THREE.MeshStandardMaterial({ color: 0x3a6b49 });
//   const tankTurret = new THREE.Mesh(turretGeometry, turretMaterial);
//   tankTurret.position.set(0, s.y / 2 + s.y / 4, 0); // oben auf dem Body
//   tankTurret.castShadow = true;
//   tankTurret.receiveShadow = true;
//
//   // Group
//   const tankGroup = new THREE.Group();
//   tankGroup.add(tankBody);
//   tankGroup.add(tankTurret);
//
//   tankGroup.position.set(p.x, p.y + s.y / 2, p.z);
//   tankBody.rotation.set(0, r, 0);
//
//   if (showHitbox) {
//     const edges = new THREE.EdgesGeometry(bodyGeometry);
//     const hitbox = new THREE.LineSegments(
//       edges,
//       new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: true }),
//     );
//     tankBody.add(hitbox);
//   }
//
//   scene.add(tankGroup);
//
//   return Promise.resolve({ tankId: tank.id, tankGroup, tankBody, tankTurret });
// }

export function addTank(scene: Scene, tank: TankResponse, showHitbox: boolean): Promise<TankGroup> {
  const s = tank.scale;
  const p = tank.position;
  const r = tank.rotation;

  // Unsichtbarer Body-Cube (Kollisionsbox)
  const bodyGeometry = new THREE.BoxGeometry(s.x, s.y, s.z);
  const bodyMaterial = new THREE.MeshStandardMaterial({ visible: false });
  const tankBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
  tankBody.castShadow = false;
  tankBody.receiveShadow = false;
  tankBody.rotation.set(0, r, 0);

  // Unsichtbarer Turret-Cube
  const turretGeometry = new THREE.BoxGeometry(s.x / 2, s.y / 2, s.z * 2);
  const turretMaterial = new THREE.MeshStandardMaterial({ visible: false });
  const tankTurret = new THREE.Mesh(turretGeometry, turretMaterial);
  tankTurret.position.set(0, s.y / 2 + s.y / 4, 0);

  // Group
  const tankGroup = new THREE.Group();
  tankGroup.add(tankBody);
  tankGroup.add(tankTurret);
  tankGroup.position.set(p.x, p.y + s.y / 2, p.z);

  if (showHitbox) {
    const edges = new THREE.EdgesGeometry(bodyGeometry);
    const hitbox = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: false }),
    );
    tankBody.add(hitbox);
  }

  // GLTF Modell laden und in tankBody einhängen
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      tank.modelUrl,
      (gltf: any) => {
        const model: THREE.Group = gltf.scene;
        const rs = tank.renderScale;
        model.scale.set(rs.x, rs.y, rs.z);

        model.position.set(0, -0.5, 0);
        model.rotation.set(0, 0, 0);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Modell an tankBody hängen → dreht sich automatisch mit
        tankBody.add(model);

        scene.add(tankGroup);
        resolve({ tankId: tank.id, tankGroup, tankBody, tankTurret });
      },
      undefined,
      reject,
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

  const box = new THREE.Box3().setFromObject(tankGroup);
  const center = new THREE.Vector3();
  box.getCenter(center);

  hitbox.position.set(
    center.x - tankGroup.position.x,
    center.y - tankGroup.position.y,
    center.z - tankGroup.position.z,
  );

  tankBody.add(hitbox);

  return hitbox;
}

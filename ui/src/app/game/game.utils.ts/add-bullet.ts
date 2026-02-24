import * as THREE from 'three';
import { Scene } from 'three';
import { BulletResponse } from '../../shared/models/bullet.model';
import { GLTF, GLTFLoader } from 'three-stdlib';

export function createBullet(
  scene: Scene,
  bullet: BulletResponse,
  showHitbox: boolean = false,
): Promise<THREE.Object3D> {
  const s = bullet.scale;
  const rs = bullet.renderScale;
  const p = bullet.position;

  // Hitbox
  const geometry = new THREE.BoxGeometry(s.x, s.y, s.z);
  const material = new THREE.MeshStandardMaterial({ visible: false });
  const bulletBody = new THREE.Mesh(geometry, material);
  bulletBody.position.set(p.x, p.y, p.z);
  bulletBody.rotation.set(0, bullet.rotation, 0);

  if (showHitbox) {
    const edges = new THREE.EdgesGeometry(geometry);
    const hitbox = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xff0000, depthTest: true }),
    );
    bulletBody.add(hitbox);
  }

  scene.add(bulletBody);

  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      bullet.modelUrl,
      (gltf: GLTF) => {
        const model: THREE.Group = gltf.scene;
        model.scale.set(rs.x, rs.y, rs.z);
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        bulletBody.add(model);

        resolve(bulletBody);
      },
      undefined,
      reject,
    );
  });
}

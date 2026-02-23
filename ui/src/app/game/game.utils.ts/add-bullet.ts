import * as THREE from 'three';
import { Scene } from 'three';
import { BulletResponse } from '../../shared/models/bullet.model';
import { create3DVector } from '../../shared/models/vector.model';

export function createBullet(scene: Scene, bullet: BulletResponse): THREE.Object3D {
  const s = bullet.renderScale;
  const p = bullet.position;
  const r = create3DVector(0, bullet.rotation, 0);

  const geometry = new THREE.BoxGeometry(s.x, s.y, s.z);
  const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(p.x, p.y, p.z);
  cube.rotation.set(r.x, r.y, r.z);
  cube.castShadow = true;
  cube.receiveShadow = true;

  scene.add(cube);

  return cube;
}

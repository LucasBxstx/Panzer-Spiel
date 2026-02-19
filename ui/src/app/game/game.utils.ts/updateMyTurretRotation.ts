import * as THREE from 'three';
import { TankGroup } from '../../shared/models/tank.model';

export function updateMyTurretRotation(
  myTank: TankGroup,
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  camera: THREE.PerspectiveCamera,
): void {
  raycaster.setFromCamera(mouse, camera);

  const turretWorldPos = new THREE.Vector3();
  myTank.tankTurret.getWorldPosition(turretWorldPos);

  const aimPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -turretWorldPos.y);

  const intersectPoint = new THREE.Vector3();
  const hit = raycaster.ray.intersectPlane(aimPlane, intersectPoint);

  if (!hit) return;

  const direction = new THREE.Vector3();
  direction.subVectors(intersectPoint, turretWorldPos);
  direction.y = 0;

  if (direction.lengthSq() < 0.0001) return;

  const targetRotationWorld = Math.atan2(direction.x, direction.z);

  const tankWorldRotation = myTank.tankGroup.rotation.y;
  const targetRotationRelative = targetRotationWorld - tankWorldRotation;

  const lerpFactor = 0.15;
  const diff = shortestRotation(myTank.tankTurret.rotation.y, targetRotationRelative);
  myTank.tankTurret.rotation.y += diff * lerpFactor;
}

export function isRotationNear(current: number, target: number, tolerance: number = 0.2): boolean {
  const diff = Math.abs(shortestRotation(current, target));
  return diff < tolerance;
}

export function shortestRotation(current: number, target: number): number {
  let diff = target - current;

  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  return diff;
}

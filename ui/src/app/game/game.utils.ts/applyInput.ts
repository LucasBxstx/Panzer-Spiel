import * as THREE from 'three';
import { isRotationNear, shortestRotation } from './updateMyTurretRotation';
import { InputState, TankPosition } from '../../shared/models/tank.model';

export function applyInput(
  tank: TankPosition,
  input: InputState,
  speed: number,
  rotationSpeed: number,
  deltaTime: number,
): TankPosition {
  const moveDirection = new THREE.Vector3();
  let targetRotation: number | null = null;
  let position = tank.position;
  let rotation = tank.rotation;

  if (input.w) {
    moveDirection.z -= 1;
    if (!isRotationNear(rotation, 0)) targetRotation = Math.PI;
  }
  if (input.s) {
    moveDirection.z += 1;
    if (!isRotationNear(rotation, Math.PI)) targetRotation = 0;
  }
  if (input.a) {
    moveDirection.x -= 1;
    if (!isRotationNear(rotation, Math.PI / 2)) targetRotation = Math.PI * 1.5;
  }
  if (input.d) {
    moveDirection.x += 1;
    if (!isRotationNear(rotation, Math.PI * 1.5)) targetRotation = Math.PI / 2;
  }

  if (input.w && input.a) targetRotation = Math.PI * 1.25;
  else if (input.w && input.d) targetRotation = Math.PI * 0.75;
  else if (input.s && input.a) targetRotation = Math.PI * 1.75;
  else if (input.s && input.d) targetRotation = Math.PI * 0.25;

  if (targetRotation !== null) {
    const diff = shortestRotation(rotation, targetRotation);
    rotation += diff * rotationSpeed * deltaTime * 60;
  }

  if (moveDirection.length() > 0) {
    moveDirection.normalize();
    position.x += moveDirection.x * speed * deltaTime * 60;
    position.z += moveDirection.z * speed * deltaTime * 60;
  }

  return { position, rotation };
}

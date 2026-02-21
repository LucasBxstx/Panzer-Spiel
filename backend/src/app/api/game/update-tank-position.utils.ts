import { Tank } from '../../common/models/tank.model';
import { InputStateDto } from './webservice/dto/update-tank-position.dto';
import { Vector3D } from '../../common/models/vector.model';
import { Position } from '../../common/models/position.model';

export function updateTankPosition(
  tank: Tank,
  input: InputStateDto,
  deltaTime: number,
) {
  const moveDirection: Position = { x: 0, y: 0, z: 0 };
  let targetRotation: number | null = null;
  const position = tank.position;
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
    rotation += diff * tank.rotationSpeed * deltaTime * 60;
  }

  if (moveDirection.x !== 0 || moveDirection.z !== 0) {
    normalizeInPlace(moveDirection);
    tank.position.x += moveDirection.x * tank.speed * deltaTime * 60;
    tank.position.z += moveDirection.z * tank.speed * deltaTime * 60;
  }

  tank.position = position;
  tank.rotation = rotation;
}

export function isRotationNear(
  current: number,
  target: number,
  tolerance: number = 0.2,
): boolean {
  const diff = Math.abs(shortestRotation(current, target));
  return diff < tolerance;
}

export function shortestRotation(current: number, target: number): number {
  let diff = target - current;

  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  return diff;
}

function normalizeInPlace(vec: Vector3D) {
  const length = Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);

  if (length === 0) return;

  vec.x /= length;
  vec.y /= length;
  vec.z /= length;
}

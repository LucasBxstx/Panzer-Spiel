import { FireBulletDto } from './webservice/dto/fire-bullet.dto';
import { Position } from '../../common/models/position.model';
import { Tank } from '../../common/models/tank.model';
import { normalizeInPlace } from '../../common/utils/vector.utils';

export function calculateBulletStartingPosition(
  bullet: FireBulletDto,
  tank: Tank,
): Position {
  const moveDirection: Position = { x: 0, y: 0, z: 0 };
  const position = structuredClone(bullet.position);

  const cameraDependentMovementHorizontally =
    tank.cameraPosition.z > 0 ? 1 : -1;
  const cameraDependentMovementVertically = tank.cameraPosition.x > 0 ? 1 : -1;
  const wrapAround = tank.cameraPosition.x !== 0;

  if (!wrapAround) {
    if (bullet.playerMovement.w) {
      moveDirection.z -= cameraDependentMovementHorizontally;
    }
    if (bullet.playerMovement.s) {
      moveDirection.z += cameraDependentMovementHorizontally;
    }
    if (bullet.playerMovement.a) {
      moveDirection.x -= cameraDependentMovementHorizontally;
    }
    if (bullet.playerMovement.d) {
      moveDirection.x += cameraDependentMovementHorizontally;
    }
  } else {
    if (bullet.playerMovement.w) {
      moveDirection.x -= cameraDependentMovementVertically;
    }
    if (bullet.playerMovement.s) {
      moveDirection.x += cameraDependentMovementVertically;
    }
    if (bullet.playerMovement.a) {
      moveDirection.z += cameraDependentMovementVertically;
    }
    if (bullet.playerMovement.d) {
      moveDirection.z -= cameraDependentMovementVertically;
    }
  }
  const FIXED_DELTA = 1 / 20;

  if (moveDirection.x !== 0 || moveDirection.z !== 0) {
    normalizeInPlace(moveDirection);
    position.z += moveDirection.z * tank.speed * FIXED_DELTA * 2;
    position.x += moveDirection.x * tank.speed * FIXED_DELTA * 2;
  }

  const turretLength = 8;
  position.x += bullet.direction.x * turretLength;
  position.y = 4;
  position.z += bullet.direction.z * turretLength;

  return position;
}

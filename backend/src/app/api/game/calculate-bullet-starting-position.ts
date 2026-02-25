import { FireBulletDto } from './webservice/dto/fire-bullet.dto';
import { Position } from '../../common/models/position.model';
import { normalizeInPlace } from '../../common/models/vector.model';
import { Tank } from '../../common/models/tank.model';

export function calculateBulletStartingPosition(
  bullet: FireBulletDto,
  tank: Tank,
): Position {
  const moveDirection: Position = { x: 0, y: 0, z: 0 };
  const position = structuredClone(bullet.position);

  if (bullet.playerMovement.w) {
    moveDirection.z -= 1;
  }
  if (bullet.playerMovement.s) {
    moveDirection.z += 1;
  }
  if (bullet.playerMovement.a) {
    moveDirection.x -= 1;
  }
  if (bullet.playerMovement.d) {
    moveDirection.x += 1;
  }

  if (moveDirection.x !== 0 || moveDirection.z !== 0) {
    normalizeInPlace(moveDirection);
    position.x += moveDirection.x * tank.speed * 2;
    position.z += moveDirection.z * tank.speed * 2;
  }

  const turretLength = 8;
  position.x += bullet.direction.x * turretLength;
  position.y = 4;
  position.z += bullet.direction.z * turretLength;

  return position;
}

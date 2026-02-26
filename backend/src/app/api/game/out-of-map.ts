import { Tank, TankMovement } from '../../common/models/tank.model';
import { GameMap } from '../../common/models/game-map.model';

export function tankOutOfMap(
  tank: Tank,
  movement: TankMovement,
  map: GameMap,
): boolean {
  const outOfMapX =
    map.scale.x / 2 - (Math.abs(movement.position.x) + tank.scale.x) <= 0;
  const outOfMapZ =
    map.scale.z / 2 - (Math.abs(movement.position.z) + tank.scale.z) <= 0;

  return outOfMapX || outOfMapZ;
}

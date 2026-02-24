import { Game } from '../../common/models/game.model';
import {
  checkCollision,
  getBulletCollisionObject,
  getTankCollisionObject,
} from './collision';
import { create3DVector } from '../../common/models/vector.model';
import { BulletMovement } from '../../common/models/bullet.model';

export function updateGameState(game: Game) {
  Array.from(game.bullets.values()).forEach((bullet) => {
    // update Position
    console.log('update bullet position,', bullet.id, bullet);
    const bulletMovement: BulletMovement = {
      position: {
        x: bullet.position.x + bullet.direction.x * bullet.speed,
        y: bullet.position.y,
        z: bullet.position.z + bullet.direction.z * bullet.speed,
      },
      rotation: create3DVector(0, bullet.rotation, 0),
    };
    console.log('updated position', bulletMovement);
    const updatedBullet = getBulletCollisionObject(bullet, bulletMovement);

    let destroyBullet = false;
    // check collision with all Obstacles
    for (const obstacle of game.gameSettings.map.obstacles) {
      const collidesObstacle = checkCollision(updatedBullet, obstacle);
      if (collidesObstacle) {
        destroyBullet = true;
        // ToDo: let bullet bounce
        console.log('bullet collides with obstacle', obstacle);
        break;
      }
    }

    // check collision with tanks
    if (!destroyBullet) {
      for (const tank of Array.from(game.tanks.values())) {
        const collidesTank = checkCollision(
          updatedBullet,
          getTankCollisionObject(tank),
        );
        if (collidesTank) {
          destroyBullet = true;
          console.log('bullet collides with tank', tank);

          break;
        }
      }
    }

    // check collision with other bullets
    if (!destroyBullet) {
      for (const otherBullet of Array.from(game.bullets.values())) {
        if (bullet.id !== otherBullet.id) {
          const collidesOtherBullet = checkCollision(
            updatedBullet,
            getBulletCollisionObject(otherBullet),
          );
          if (collidesOtherBullet) {
            destroyBullet = true;

            console.log('bullet collides with other bullet', otherBullet);
            break;
          }
        }
      }
    }

    // check out of map
    const mapScale = game.gameSettings.map.scale;
    const outOfMapX = Math.abs(updatedBullet.position.x) > mapScale.x / 2;
    const outOfMapZ = Math.abs(updatedBullet.position.z) > mapScale.z / 2;
    if (outOfMapX || outOfMapZ) {
      destroyBullet = true;

      console.log('bullet out of map');
    }

    if (destroyBullet) {
      console.log('destroy bullet');
      game.bullets.delete(bullet.id);
      const tank = game.tanks.get(bullet.tankId);
      if (tank) {
        const index = tank.bulletIds.findIndex(
          (bulletId) => bulletId === bullet.id,
        );
        if (index > -1) {
          tank.bulletIds.splice(index, 1);
        }
      }
    } else {
      bullet.position.x = updatedBullet.position.x;
      bullet.position.y = updatedBullet.position.y;
      bullet.position.z = updatedBullet.position.z;
      console.log('update bullet position', bullet);
    }

    console.log('bullet update completed', bullet.id);
  });
}

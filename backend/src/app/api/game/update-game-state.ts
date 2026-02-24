import { Game } from '../../common/models/game.model';
import {
  checkCollision,
  CollisionObject,
  getBulletCollisionObject,
  getTankCollisionObject,
} from './collision';
import { create3DVector } from '../../common/models/vector.model';
import { Bullet, BulletMovement } from '../../common/models/bullet.model';

export function calculateNewBulletPosition(bullet: Bullet): CollisionObject {
  const bulletMovement: BulletMovement = {
    position: {
      x: bullet.position.x + bullet.direction.x * bullet.speed,
      y: bullet.position.y,
      z: bullet.position.z + bullet.direction.z * bullet.speed,
    },
    rotation: create3DVector(0, bullet.rotation, 0),
  };

  return getBulletCollisionObject(bullet, bulletMovement);
}

export function checkAndHandleBulletCollisionWithObstacles(
  game: Game,
  updatedBullet: CollisionObject,
): boolean {
  for (const obstacle of game.gameSettings.map.obstacles) {
    const collidesObstacle = checkCollision(updatedBullet, obstacle);
    if (collidesObstacle) {
      // ToDo: let bullet bounce
      return true;
    }
  }
  return false;
}

export function checkAndHandleBulletCollisionWithTank(
  game: Game,
  bullet: Bullet,
  updatedBullet: CollisionObject,
): boolean {
  for (const tank of Array.from(game.tanks.values())) {
    if (tank.isDead) continue;

    const collidesTank = checkCollision(
      updatedBullet,
      getTankCollisionObject(tank),
    );
    if (collidesTank) {
      tank.hp -= bullet.damage;
      tank.isDead = tank.hp <= 0;

      if (tank.isDead) {
        const killerTank = game.tanks.get(bullet.tankId);
        if (killerTank) killerTank.kills += 1;
      }

      return true;
    }
  }
  return false;
}

export function checkAndHandleBulletCollisionWithOtherBullets(
  game: Game,
  bullet: Bullet,
  updatedBullet: CollisionObject,
): boolean {
  for (const otherBullet of Array.from(game.bullets.values())) {
    if (bullet.id !== otherBullet.id) {
      const collidesOtherBullet = checkCollision(
        updatedBullet,
        getBulletCollisionObject(otherBullet),
      );
      if (collidesOtherBullet) {
        removeBullet(game, otherBullet);
        return true;
      }
    }
  }

  return false;
}

export function checkBulletOutOfMap(
  game: Game,
  updatedBullet: CollisionObject,
): boolean {
  const mapScale = game.gameSettings.map.scale;
  const outOfMapX = Math.abs(updatedBullet.position.x) > mapScale.x / 2;
  const outOfMapZ = Math.abs(updatedBullet.position.z) > mapScale.z / 2;

  return outOfMapX || outOfMapZ;
}

export function updateGameState(game: Game) {
  Array.from(game.bullets.values()).forEach((bullet) => {
    // update Position

    const updatedBullet = calculateNewBulletPosition(bullet);

    let destroyBullet = false;
    // check collision with all Obstacles
    destroyBullet = checkAndHandleBulletCollisionWithObstacles(
      game,
      updatedBullet,
    );

    // check collision with tanks
    if (!destroyBullet) {
      destroyBullet = checkAndHandleBulletCollisionWithTank(
        game,
        bullet,
        updatedBullet,
      );
    }

    // check collision with other bullets
    if (!destroyBullet) {
      destroyBullet = checkAndHandleBulletCollisionWithOtherBullets(
        game,
        bullet,
        updatedBullet,
      );
    }

    // check out of map
    if (!destroyBullet) {
      destroyBullet = checkBulletOutOfMap(game, updatedBullet);
    }

    if (destroyBullet) {
      removeBullet(game, bullet);
    } else {
      bullet.position.x = updatedBullet.position.x;
      bullet.position.y = updatedBullet.position.y;
      bullet.position.z = updatedBullet.position.z;
    }
  });
}

function removeBullet(game: Game, bullet: Bullet): void {
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
}

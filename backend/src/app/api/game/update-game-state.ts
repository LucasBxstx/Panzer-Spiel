import { Game } from '../../common/models/game.model';
import {
  checkCollision,
  CollisionObject,
  getBulletCollisionObject,
  getCollisionNormal,
  getTankCollisionObject,
  reflectVector,
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
  bullet: Bullet,
  updatedBullet: CollisionObject,
): boolean {
  for (const obstacle of game.gameSettings.map.obstacles) {
    const normal = getCollisionNormal(updatedBullet, obstacle);
    if (normal) {
      if (bullet.bounceCount < bullet.maxBounceCount) {
        const reflected = reflectVector(
          { x: bullet.direction.x, z: bullet.direction.z },
          normal,
        );
        bullet.direction.x = reflected.x;
        bullet.direction.z = reflected.z;

        const newRotation = Math.atan2(reflected.x, reflected.z);
        bullet.rotation = newRotation;
        updatedBullet.rotation.y = newRotation;

        updatedBullet.position.x += bullet.direction.x * bullet.speed;
        updatedBullet.position.z += bullet.direction.z * bullet.speed;

        bullet.bounceCount++;
        bullet.playSound = 'bullet-bounce';
      } else {
        bullet.playSound = 'bullet-hit';
        bullet.isCollided = true;
      }

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
      bullet.isCollided = true;

      if (tank.isDead) {
        const killerTank = game.tanks.get(bullet.tankId);
        if (killerTank) killerTank.kills += 1;
        bullet.playSound = 'tank-explosion';
      } else {
        bullet.playSound = 'tank-hit';
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
        bullet.playSound = 'bullet-hit';
        bullet.isCollided = true;
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
    if (bullet.isCollided) return;

    // update Position
    const updatedBullet = calculateNewBulletPosition(bullet);

    // check collision with all Obstacles
    let destroyBullet = checkAndHandleBulletCollisionWithObstacles(
      game,
      bullet,
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
      const isOutOfMap = checkBulletOutOfMap(game, updatedBullet);
      if (isOutOfMap) {
        bullet.isCollided = true;
        bullet.playSound = 'bullet-hit';
      }
    }

    bullet.position.x = updatedBullet.position.x;
    bullet.position.y = updatedBullet.position.y;
    bullet.position.z = updatedBullet.position.z;
  });
}

export function removeBullet(game: Game, bullet: Bullet): void {
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

export function removeBulletSoundEffects(game: Game) {
  Array.from(game.bullets.values()).forEach((bullet) => {
    bullet.playSound = undefined;
    if (bullet.isCollided) removeBullet(game, bullet);
  });
}

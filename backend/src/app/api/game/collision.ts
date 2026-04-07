import { Tank, TankMovement } from '../../common/models/tank.model';
import { Obstacle } from '../../common/models/obstacle.model';
import { Scale } from '../../common/models/scale.model';
import { Position } from '../../common/models/position.model';
import { PlaneVector, Vector3D } from '../../common/models/vector.model';
import { Bullet, BulletMovement } from '../../common/models/bullet.model';
import { create3DVector } from '../../common/utils/vector.utils';

export interface CollisionObject {
  position: Position;
  scale: Scale;
  rotation: Vector3D;
}

export function getTankCollisionObject(
  tank: Tank,
  movement?: TankMovement,
): CollisionObject {
  return {
    position: structuredClone(movement ? movement.position : tank.position),
    rotation: create3DVector(
      0,
      movement ? movement.rotation.y : tank.rotation,
      0,
    ),
    scale: structuredClone(tank.scale),
  };
}

export function getBulletCollisionObject(
  bullet: Bullet,
  movement?: BulletMovement,
): CollisionObject {
  return {
    position: structuredClone(movement ? movement.position : bullet.position),
    rotation: create3DVector(
      0,
      movement ? movement.rotation.y : bullet.rotation,
      0,
    ),
    scale: structuredClone(bullet.scale),
  };
}

export function tankCollidesTank(
  myTankObj: Tank,
  myTankMovement: TankMovement,
  otherTankObjs: Tank[],
): boolean {
  const myTank = getTankCollisionObject(myTankObj, myTankMovement);

  for (const otherTankObj of otherTankObjs) {
    const otherTank = getTankCollisionObject(otherTankObj);
    if (checkCollision(myTank, otherTank)) {
      return true;
    }
  }

  return false;
}

// OBB collision
export function tankCollidesObstacle(
  tankObj: Tank,
  tankMovement: TankMovement,
  obstacles: Obstacle[],
) {
  const tank = getTankCollisionObject(tankObj, tankMovement);

  for (const obstacle of obstacles) {
    if (checkCollision(obstacle, tank)) {
      return true;
    }
  }

  return false;
}

export function checkCollision<T extends CollisionObject>(a: T, b: T): boolean {
  const halfA = { x: a.scale.x / 2, z: a.scale.z / 2 };
  const halfB = { x: b.scale.x / 2, z: b.scale.z / 2 };

  const angleA = a.rotation.y;
  const angleB = b.rotation.y;

  const axesA: [PlaneVector, PlaneVector] = [
    { x: Math.cos(angleA), z: Math.sin(angleA) },
    { x: -Math.sin(angleA), z: Math.cos(angleA) },
  ];
  const axesB: [PlaneVector, PlaneVector] = [
    { x: Math.cos(angleB), z: Math.sin(angleB) },
    { x: -Math.sin(angleB), z: Math.cos(angleB) },
  ];

  const delta = {
    x: b.position.x - a.position.x,
    z: b.position.z - a.position.z,
  };

  // SAT: 4 Achsen testen (2 pro OBB)
  const testAxes: PlaneVector[] = [...axesA, ...axesB];

  for (const axis of testAxes) {
    const distance = Math.abs(dot2D(delta, axis));
    const projA =
      Math.abs(dot2D(axesA[0], axis)) * halfA.x +
      Math.abs(dot2D(axesA[1], axis)) * halfA.z;
    const projB =
      Math.abs(dot2D(axesB[0], axis)) * halfB.x +
      Math.abs(dot2D(axesB[1], axis)) * halfB.z;

    if (distance > projA + projB) return false;
  }

  return true;
}

function dot2D(a: PlaneVector, b: PlaneVector): number {
  return a.x * b.x + a.z * b.z;
}

export function getCollisionNormal(
  bullet: CollisionObject,
  obstacle: CollisionObject,
): PlaneVector | null {
  const angleA = bullet.rotation.y;
  const angleB = obstacle.rotation.y;

  const axesA: [PlaneVector, PlaneVector] = [
    { x: Math.cos(angleA), z: Math.sin(angleA) },
    { x: -Math.sin(angleA), z: Math.cos(angleA) },
  ];
  const axesB: [PlaneVector, PlaneVector] = [
    { x: Math.cos(angleB), z: Math.sin(angleB) },
    { x: -Math.sin(angleB), z: Math.cos(angleB) },
  ];

  const delta = {
    x: obstacle.position.x - bullet.position.x,
    z: obstacle.position.z - bullet.position.z,
  };

  const halfA = { x: bullet.scale.x / 2, z: bullet.scale.z / 2 };
  const halfB = { x: obstacle.scale.x / 2, z: obstacle.scale.z / 2 };

  const testAxes: PlaneVector[] = [...axesA, ...axesB];

  let minOverlap = Infinity;
  let collisionNormal: PlaneVector = { x: 0, z: 0 };

  for (const axis of testAxes) {
    const distance = Math.abs(dot2D(delta, axis));
    const projA =
      Math.abs(dot2D(axesA[0], axis)) * halfA.x +
      Math.abs(dot2D(axesA[1], axis)) * halfA.z;
    const projB =
      Math.abs(dot2D(axesB[0], axis)) * halfB.x +
      Math.abs(dot2D(axesB[1], axis)) * halfB.z;

    const overlap = projA + projB - distance;
    if (overlap < 0) return null; // Keine Kollision

    if (overlap < minOverlap) {
      minOverlap = overlap;
      // Normale zeigt vom Obstacle zum Bullet
      const sign = dot2D(delta, axis) < 0 ? 1 : -1;
      collisionNormal = { x: axis.x * sign, z: axis.z * sign };
    }
  }

  return collisionNormal;
}

export function reflectVector(d: PlaneVector, n: PlaneVector): PlaneVector {
  // r = d - 2(d·n)n  (n muss normalisiert sein)
  const dot = dot2D(d, n);
  return {
    x: d.x - 2 * dot * n.x,
    z: d.z - 2 * dot * n.z,
  };
}

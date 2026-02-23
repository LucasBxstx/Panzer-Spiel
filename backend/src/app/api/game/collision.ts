import { Tank, TankMovement } from '../../common/models/tank.model';
import { Obstacle } from '../../common/models/obstacle.model';
import { Scale } from '../../common/models/scale.model';
import { Position } from '../../common/models/position.model';
import {
  create3DVector,
  PlaneVector,
  Vector3D,
} from '../../common/models/vector.model';

export interface CollisionObject {
  position: Position;
  scale: Scale;
  rotation: Vector3D;
}

export function getTankNewPosition(
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

export function tankCollidesTank(
  myTankObj: Tank,
  myTankMovement: TankMovement,
  otherTankObjs: Tank[],
): boolean {
  const myTank = getTankNewPosition(myTankObj, myTankMovement);

  for (const otherTankObj of otherTankObjs) {
    const otherTank = getTankNewPosition(otherTankObj);
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
  const tank = getTankNewPosition(tankObj, tankMovement);

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

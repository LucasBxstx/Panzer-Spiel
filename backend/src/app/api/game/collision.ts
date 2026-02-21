import { Tank, TankMovement } from '../../common/models/tank.model';
import { Obstacle } from '../../common/models/obstacle.model';
import { Scale } from '../../common/models/scale.model';
import { Position } from '../../common/models/position.model';
import { Vector3D } from '../../common/models/vector.model';

export function tankCollidesObstacle(
  tank: Tank,
  tankMovement: TankMovement,
  obstacles: Obstacle[],
) {
  const newTank = {
    position: structuredClone(tankMovement.position),
    rotation: structuredClone(tankMovement.rotation),
    scale: structuredClone(tank.scale),
  };

  for (const obstacle of obstacles) {
    if (checkCollision(obstacle, newTank)) {
      return true;
    }
  }

  return false;
}

function dot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function length(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function normalize(v: Vector3D): Vector3D {
  const l = length(v);
  if (l === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

// Rotationsmatrix aus Euler-Winkeln (XYZ-Reihenfolge)
function getAxes(rotation: Vector3D): [Vector3D, Vector3D, Vector3D] {
  const { x: rx, y: ry, z: rz } = rotation;

  const cx = Math.cos(rx),
    sx = Math.sin(rx);
  const cy = Math.cos(ry),
    sy = Math.sin(ry);
  const cz = Math.cos(rz),
    sz = Math.sin(rz);

  // Lokale X-, Y-, Z-Achse nach Rotation
  const axisX: Vector3D = {
    x: cy * cz,
    y: cy * sz,
    z: -sy,
  };
  const axisY: Vector3D = {
    x: sx * sy * cz - cx * sz,
    y: sx * sy * sz + cx * cz,
    z: sx * cy,
  };
  const axisZ: Vector3D = {
    x: cx * sy * cz + sx * sz,
    y: cx * sy * sz - sx * cz,
    z: cx * cy,
  };

  return [axisX, axisY, axisZ];
}

// Projektion der OBB auf eine Achse
function projectOBB(
  axes: [Vector3D, Vector3D, Vector3D],
  halfExtents: Vector3D,
  axis: Vector3D,
): number {
  return (
    Math.abs(dot(axes[0], axis)) * halfExtents.x +
    Math.abs(dot(axes[1], axis)) * halfExtents.y +
    Math.abs(dot(axes[2], axis)) * halfExtents.z
  );
}

// Prüft ob eine Trennachse existiert
function isSeparated(
  delta: Vector3D,
  axis: Vector3D,
  axesA: [Vector3D, Vector3D, Vector3D],
  halfA: Vector3D,
  axesB: [Vector3D, Vector3D, Vector3D],
  halfB: Vector3D,
): boolean {
  const l = length(axis);
  if (l < 1e-10) return false; // Degenerierte Achse überspringen

  const normalizedAxis = normalize(axis);
  const distance = Math.abs(dot(delta, normalizedAxis));
  const projA = projectOBB(axesA, halfA, normalizedAxis);
  const projB = projectOBB(axesB, halfB, normalizedAxis);

  return distance > projA + projB;
}

// Hauptfunktion
export function checkCollision<
  T extends { position: Position; scale: Scale; rotation: Vector3D },
>(a: T, b: T): boolean {
  // Halbe Ausdehnung (Scale als volle Größe angenommen)
  const halfA: Vector3D = {
    x: a.scale.x / 2,
    y: a.scale.y / 2,
    z: a.scale.z / 2,
  };
  const halfB: Vector3D = {
    x: b.scale.x / 2,
    y: b.scale.y / 2,
    z: b.scale.z / 2,
  };

  const axesA = getAxes(a.rotation);
  const axesB = getAxes(b.rotation);

  // Vektor zwischen den Mittelpunkten
  const delta: Vector3D = {
    x: b.position.x - a.position.x,
    y: b.position.y - a.position.y,
    z: b.position.z - a.position.z,
  };

  // 15 Trennachsen testen (SAT)
  const testAxes: Vector3D[] = [
    // 3 Achsen von A
    ...axesA,
    // 3 Achsen von B
    ...axesB,
    // 9 Kreuzprodukte
    cross(axesA[0], axesB[0]),
    cross(axesA[0], axesB[1]),
    cross(axesA[0], axesB[2]),
    cross(axesA[1], axesB[0]),
    cross(axesA[1], axesB[1]),
    cross(axesA[1], axesB[2]),
    cross(axesA[2], axesB[0]),
    cross(axesA[2], axesB[1]),
    cross(axesA[2], axesB[2]),
  ];

  for (const axis of testAxes) {
    if (isSeparated(delta, axis, axesA, halfA, axesB, halfB)) {
      return false; // Lücke gefunden → keine Kollision
    }
  }

  return true;
}

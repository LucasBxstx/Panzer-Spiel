import { Vector3D } from '../models/vector.model';

export function create3DVector(x: number, y: number, z: number): Vector3D {
  return {
    x,
    y,
    z,
  };
}
export function normalizeInPlace(vec: Vector3D) {
  const length = Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);

  if (length === 0) return;

  vec.x /= length;
  vec.y /= length;
  vec.z /= length;
}

export function subtractVectors(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z,
  };
}

export function addVectors(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
}

export function multiplyVector(vector: Vector3D, factor: number): Vector3D {
  return {
    x: vector.x * factor,
    y: vector.y * factor,
    z: vector.z * factor,
  };
}

export function getVectorMagnitude(v: Vector3D): number {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

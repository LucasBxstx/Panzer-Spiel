export interface PlaneVector {
  x: number;
  z: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

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

export function getDirectionVector(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z,
  };
}

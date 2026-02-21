export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

export interface Position extends Vector3D {}

export interface Scale extends Vector3D {}

export function create3DVector(x: number, y: number, z: number): Vector3D {
  return {
    x,
    y,
    z,
  };
}

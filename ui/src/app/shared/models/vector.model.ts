export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D extends Vector2D {
  z: number;
}

export interface Position extends Vector3D {}

export interface Scale extends Vector3D {}

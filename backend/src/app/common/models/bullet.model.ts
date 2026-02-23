import { Position } from './position.model';
import { Vector3D } from './vector.model';
import { Scale } from './scale.model';

export interface Bullet {
  id: string;
  name: string;
  tankId: string;
  position: Position;
  direction: Vector3D;
  scale: Scale;
  renderScale: Scale;
  speed: number;
  damage: number;
  maxBounceCount: number;
  bounceCount: number;
  rotation: number;
  modelUrl: string;
}

export interface BulletVariant {
  id: string;
  name: string;
  speed: number;
  damage: number;
  maxBounceCount: number;
  modelUrl: string;
  scale: Scale;
  renderScale: Scale;
}

export interface BulletMovement {
  position: Position;
  rotation: Vector3D;
}

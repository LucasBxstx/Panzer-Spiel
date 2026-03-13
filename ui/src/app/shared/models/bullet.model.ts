import { Position, Scale } from './vector.model';
import * as THREE from 'three';

export interface BulletResponse {
  id: string;
  variantId: string;
  position: Position;
  rotation: number;
  renderScale: Scale;
  scale: Scale;
  playSound?: string;
}

export interface BulletObject {
  id: string;
  object: THREE.Object3D;
}

import { Position, Scale } from './vector.model';
import * as THREE from 'three';

export interface BulletResponse {
  id: string;
  position: Position;
  rotation: number;
  modelUrl: string;
  renderScale: Scale;
  scale: Scale;
}

export interface BulletObject {
  id: string;
  object: THREE.Object3D;
}

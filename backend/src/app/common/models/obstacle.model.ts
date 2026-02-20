import { Scale } from './scale.model';
import { Position } from './position.model';
import { Texture } from './texture.model';
import { Vector3D } from './vector.model';

export interface Obstacle {
  id: string;
  name: string;
  position: Position;
  scale: Scale;
  renderScale: Scale;
  rotation: Vector3D;
  modelUrl?: string;
  texture?: Texture;
  color?: string;
}

import { Vector2D } from './vector.model';

export interface Texture {
  id: string;
  name: string;
  diffuseImageUrl: string;
  normalImageUrl: string;
  roughnessImageUrl: string;
  repeat: Vector2D;
}

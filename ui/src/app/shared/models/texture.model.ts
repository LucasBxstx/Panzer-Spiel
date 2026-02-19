import { Vector2D } from './vector.model';

export interface TextureResponse {
  id: string;
  name: string;
  diffuseImageUrl: string;
  normalImageUrl: string;
  roughnessImageUrl: string;
  repeat: Vector2D;
}

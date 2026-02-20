import { Position, Scale, Vector3D } from './vector.model';
import { TextureResponse } from './texture.model';

export interface ObstacleResponse {
  id: string;
  name: string;
  scale: Scale;
  renderScale: Scale;
  position: Position;
  rotation: Vector3D;
  modelUrl?: string;
  texture?: TextureResponse;
  color?: string;
}

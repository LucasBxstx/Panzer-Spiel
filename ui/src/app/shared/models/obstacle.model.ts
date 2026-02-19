import { Position, Scale } from './vector.model';
import { TextureResponse } from './texture.model';

export interface ObstacleResponse {
  id: string;
  name: string;
  scale: Scale;
  renderScale: Scale;
  position: Position;
  modelUrl?: string;
  texture?: TextureResponse;
  color?: string;
}

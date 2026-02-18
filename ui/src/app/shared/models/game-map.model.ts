import { TextureResponse } from './texture.model';
import { ObstacleResponse } from './obstacle.model';
import { Scale } from './vector.model';

export interface GameMapResponse {
  id: string;
  name: string;
  obstacles: ObstacleResponse[];
  scale: Scale;
  groundTexture: TextureResponse;
}

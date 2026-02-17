import { Scale } from './scale.model';
import { Position } from './position.model';
import { Texture } from './texture.model';

export interface Obstacle {
  id: string;
  name: string;
  position: Position;
  scale: Scale;
  renderScale: Scale;
  modelUrl?: string;
  texture?: Texture;
  color?: string;
}

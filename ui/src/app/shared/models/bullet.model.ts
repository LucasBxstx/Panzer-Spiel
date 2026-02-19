import { Position, Scale } from './vector.model';

export interface BulletResponse {
  id: string;
  position: Position;
  rotatioin: number;
  modelUrl: string;
  renderScale: Scale;
}

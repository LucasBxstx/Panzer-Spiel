import { Position, Scale } from './vector.model';

export interface TankResponse {
  id: string;
  playerName: string;
  modelUrl: string;
  position: Position;
  renderScale: Scale;
  speed: number;
  rotationSpeed: number;
  rotation: number;
  kills: number;
  idDead: boolean;
}

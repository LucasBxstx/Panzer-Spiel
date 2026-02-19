import { Scale } from './scale.model';
import { Position } from './position.model';

export interface Tank {
  id: string;
  playerName: string;
  userId: string;
  teamId: string;
  modelUrl: string;
  position: Position;
  scale: Scale;
  renderScale: Scale;
  tankVariantId: string;
  hp: number;
  speed: number;
  rotationSpeed: number;
  maxBullets: number;
  bulletIds: string[];
  kills: number;
  isDead: boolean;
  rotation: number;
  crossHair: Position;
}

export interface TankVariant {
  id: string;
  name: string;
  modelUrl: string;
  scale: Scale;
  renderScale: Scale;
  speed: number;
  maxHp: number;
  maxBullets: number;
  rotationSpeed: number;
}

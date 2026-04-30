import { Scale } from './scale.model';
import { Position } from './position.model';
import { Vector3D } from './vector.model';

export interface Tank {
  id: string;
  playerName: string;
  userId: string;
  teamId: string;
  teamColor: string;
  modelUrl: string;
  position: Position;
  scale: Scale;
  renderScale: Scale;
  tankVariantId: string;
  bulletVariantId: string;
  cameraPosition: Position;
  hp: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  turretRotation: number;
  maxBullets: number;
  bulletIds: string[];
  kills: number;
  isDead: boolean;
  crossHair: Position;
  lastProcessedSeq: number;
}

export interface TankVariant {
  id: string;
  tankType: TankType;
  name: string;
  modelUrl: string;
  scale: Scale;
  renderScale: Scale;
  speed: number;
  maxHp: number;
  maxBullets: number;
  rotationSpeed: number;
  bulletVariantId: string;
}

export interface TankMovement {
  position: Position;
  rotation: Vector3D;
}

export enum TankType {
  Panther = 'Panther',
  Razor = 'Razor',
  Inferno = 'Inferno',
  Nightshade = 'Nightshade',
  Reaper = 'Reaper',
}

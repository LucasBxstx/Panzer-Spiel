import { Position, Scale, Vector3D } from './vector.model';
import * as THREE from 'three';
import { CSS2DObject } from 'three-stdlib';

export interface TankResponse {
  id: string;
  playerName: string;
  teamColor: string;
  modelUrl: string;
  position: Position;
  cameraPosition: Position;
  renderScale: Scale;
  scale: Scale;
  speed: number;
  rotationSpeed: number;
  rotation: number;
  turretRotation: number;
  kills: number;
  hp: number;
  maxHp: number;
  idDead: boolean;
  seq: number;
}

export interface TankProps {
  speed: number;
  rotationSpeed: number;
  seq: number;
}

export function getMyTankProps(
  tanks: Map<string, TankResponse>,
  myTankId: string,
): TankProps | null {
  const myTank = tanks.get(myTankId);

  if (!myTank) return null;

  return {
    speed: myTank.speed,
    rotationSpeed: myTank.rotationSpeed,
    seq: myTank.seq,
  };
}

export interface TankGroup {
  tankId: string;
  tankGroup: THREE.Group;
  tankBody: THREE.Object3D;
  tankTurret: THREE.Object3D;
  nameLabel: CSS2DObject;
  hpLabel: CSS2DObject;
}

export interface InputState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

export interface TankPosition {
  position: Position;
  rotation: number;
}

export interface UpdateTankPosition {
  seq: number;
  input: InputState;
  timestamp: number;
}

export interface UpdateTurretRotation {
  rotation: number;
}

export interface TankPositionResponse {
  id: string;
  position: Position;
  rotation: number;
  turretRotation: number;
  seq: number;
  kills: number;
  isDead: boolean;
  hp: number;
}

export interface FireBulletRequest {
  position: Position;
  direction: Vector3D;
  rotation: number;
  playerMovement: InputState;
}

export enum TankType {
  Panther = 'Panther',
  Razor = 'Razor',
  Inferno = 'Inferno',
  Nightshade = 'Nightshade',
  Reaper = 'Reaper',
}

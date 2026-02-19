import { Position, Scale } from './vector.model';
import * as THREE from 'three';

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
  deltaTime: number;
  timestamp: number;
}

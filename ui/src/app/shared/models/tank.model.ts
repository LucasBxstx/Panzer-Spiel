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
}

export interface TankProps {
  speed: number;
  rotationSpeed: number;
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
  };
}

export interface TankGroup {
  tankId: string;
  tankGroup: THREE.Group;
  tankBody: THREE.Object3D;
  tankTurret: THREE.Object3D;
}

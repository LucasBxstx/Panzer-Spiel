import { Chunk } from '../../api/game/maps/map.utils';
import { TankType } from './tank.model';

export interface Bot {
  id: string;
  tankId: string;
  difficulty: BotDifficulty;
  targetedTankId: string;
  lastShoot: Date;
  shootingBufferMS: number;
  nextDestinations: Chunk[];
  lastDestinationUpdate: Date;
  destinationBufferMS: number;
  jitterExtent: number;
}

export interface BotVariant {
  id: string;
  botDifficulty: BotDifficulty;
  shootingBufferMS: number;
  destinationBufferMS: number;
  jitterExtent: number;
}

export enum BotDifficulty {
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  HARD = 'hard',
}

export interface BotSetting {
  tankType: TankType;
  difficulty: BotDifficulty;
}

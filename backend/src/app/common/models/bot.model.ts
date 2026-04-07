import { Chunk } from '../../api/game/maps/map.utils';

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
}

export enum BotDifficulty {
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  HARD = 'hard',
}

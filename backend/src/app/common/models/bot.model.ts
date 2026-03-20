import { Position } from './position.model';

export interface Bot {
  id: string;
  tankId: string;
  difficulty: BotDifficulty;
  targetedTankId: string;
  nextDestination: Position;
}

export enum BotDifficulty {
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  HARD = 'hard',
}

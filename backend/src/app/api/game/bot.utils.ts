import { BotDifficulty, BotVariant } from '../../common/models/bot.model';

export function getBotVariant(
  difficulty: BotDifficulty,
): BotVariant | undefined {
  return [
    getBotEasy(),
    getBotAdvanced(),
    getBotIntermediate(),
    getBotHard(),
  ].find((b) => b.botDifficulty === difficulty);
}

export function getBotEasy(): BotVariant {
  return {
    id: 'easy',
    botDifficulty: BotDifficulty.EASY,
    destinationBufferMS: 5000,
    shootingBufferMS: 3000,
    jitterExtent: 0.3,
  };
}

export function getBotIntermediate(): BotVariant {
  return {
    id: 'intermediate',
    botDifficulty: BotDifficulty.INTERMEDIATE,
    destinationBufferMS: 4000,
    shootingBufferMS: 2000,
    jitterExtent: 0.2,
  };
}

export function getBotAdvanced(): BotVariant {
  return {
    id: 'advanced',
    botDifficulty: BotDifficulty.ADVANCED,
    destinationBufferMS: 2000,
    shootingBufferMS: 1000,
    jitterExtent: 0.1,
  };
}

export function getBotHard(): BotVariant {
  return {
    id: 'hard',
    botDifficulty: BotDifficulty.HARD,
    destinationBufferMS: 1000,
    shootingBufferMS: 500,
    jitterExtent: 0,
  };
}

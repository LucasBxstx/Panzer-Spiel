import { Level } from '../../../common/models/level.model';
import { TankType } from '../../../common/models/tank.model';
import { BotDifficulty } from '../../../common/models/bot.model';

export function findLevel(id: number): Level | undefined {
  return getAllLevels().find((l) => l.id === id);
}

export function getAllLevels(): Level[] {
  return [
    getLevel1(),
    getLevel2(),
    getLevel3(),
    getLevel4(),
    getLevel5(),
    getLevel6(),
  ];
}

function getLevel1(): Level {
  return {
    id: 1,
    name: 'Level 1',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
    ],
  };
}

function getLevel2(): Level {
  return {
    id: 2,
    name: 'Level 2',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel3(): Level {
  return {
    id: 3,
    name: 'Level 3',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel4(): Level {
  return {
    id: 4,
    name: 'Level 4',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel5(): Level {
  return {
    id: 5,
    name: 'Level 5',
    mapId: 'desertbarricade',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel6(): Level {
  return {
    id: 6,
    name: 'Level 6',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

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
    getLevel7(),
    getLevel8(),
    getLevel9(),
    getLevel10(),
    getLevel11(),
    getLevel12(),
    getLevel13(),
    getLevel14(),
    getLevel15(),
    getLevel16(),
    getLevel17(),
    getLevel18(),
    getLevel19(),
    getLevel20(),
    getLevel21(),
    getLevel22(),
    getLevel23(),
    getLevel24(),
    getLevel25(),
    getLevel26(),
    getLevel27(),
    getLevel28(),
    getLevel29(),
    getLevel30(),
    getLevel31(),
    getLevel32(),
    getLevel33(),
    getLevel34(),
    getLevel35(),
    getLevel36(),
    getLevel37(),
    getLevel38(),
    getLevel39(),
    getLevel40(),
    getLevel41(),
    getLevel42(),
    getLevel43(),
    getLevel44(),
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
        difficulty: BotDifficulty.EASY,
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
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
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
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
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

function getLevel7(): Level {
  return {
    id: 7,
    name: 'Level 7',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel8(): Level {
  return {
    id: 8,
    name: 'Level 8',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
    ],
  };
}

function getLevel9(): Level {
  return {
    id: 9,
    name: 'Level 9',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel10(): Level {
  return {
    id: 10,
    name: 'Level 10',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel11(): Level {
  return {
    id: 11,
    name: 'Level 11',
    mapId: 'desertbarricade',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel12(): Level {
  return {
    id: 12,
    name: 'Level 12',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel13(): Level {
  return {
    id: 12,
    name: 'Level 12',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel14(): Level {
  return {
    id: 14,
    name: 'Level 14',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
    ],
  };
}

function getLevel15(): Level {
  return {
    id: 15,
    name: 'Level 15',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel16(): Level {
  return {
    id: 16,
    name: 'Level 16',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel17(): Level {
  return {
    id: 17,
    name: 'Level 17',
    mapId: 'desertbarricade',
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

function getLevel18(): Level {
  return {
    id: 18,
    name: 'Level 18',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.EASY,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel19(): Level {
  return {
    id: 19,
    name: 'Level 19',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel20(): Level {
  return {
    id: 20,
    name: 'Level 20',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
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

function getLevel21(): Level {
  return {
    id: 21,
    name: 'Level 21',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel22(): Level {
  return {
    id: 22,
    name: 'Level 22',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel23(): Level {
  return {
    id: 23,
    name: 'Level 23',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel24(): Level {
  return {
    id: 24,
    name: 'Level 24',
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

function getLevel25(): Level {
  return {
    id: 25,
    name: 'Level 25',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel26(): Level {
  return {
    id: 26,
    name: 'Level 26',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
    ],
  };
}

function getLevel27(): Level {
  return {
    id: 27,
    name: 'Level 27',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel28(): Level {
  return {
    id: 28,
    name: 'Level 28',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel29(): Level {
  return {
    id: 29,
    name: 'Level 29',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel30(): Level {
  return {
    id: 30,
    name: 'Level 30',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel31(): Level {
  return {
    id: 31,
    name: 'Level 31',
    mapId: 'desertbarricade',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel32(): Level {
  return {
    id: 32,
    name: 'Level 32',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel33(): Level {
  return {
    id: 33,
    name: 'Level 33',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel34(): Level {
  return {
    id: 34,
    name: 'Level 34',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel35(): Level {
  return {
    id: 35,
    name: 'Level 35',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel36(): Level {
  return {
    id: 36,
    name: 'Level 36',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel37(): Level {
  return {
    id: 37,
    name: 'Level 37',
    mapId: 'desertbarricade',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel38(): Level {
  return {
    id: 38,
    name: 'Level 38',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel39(): Level {
  return {
    id: 39,
    name: 'Level 39',
    mapId: 'containerhub',
    botSettings: [
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel40(): Level {
  return {
    id: 40,
    name: 'Level 40',
    mapId: 'containerport',
    botSettings: [
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel41(): Level {
  return {
    id: 41,
    name: 'Level 41',
    mapId: 'containeryard',
    botSettings: [
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Reaper,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

function getLevel42(): Level {
  return {
    id: 42,
    name: 'Level 42',
    mapId: 'canyonclash',
    botSettings: [
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel43(): Level {
  return {
    id: 43,
    name: 'Level 43',
    mapId: 'desertbarricade',
    botSettings: [
      {
        tankType: TankType.Panther,
        difficulty: BotDifficulty.INTERMEDIATE,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
    ],
  };
}

function getLevel44(): Level {
  return {
    id: 44,
    name: 'Level 44',
    mapId: 'wastelanddivide',
    botSettings: [
      {
        tankType: TankType.Razor,
        difficulty: BotDifficulty.ADVANCED,
      },
      {
        tankType: TankType.Nightshade,
        difficulty: BotDifficulty.HARD,
      },
      {
        tankType: TankType.Inferno,
        difficulty: BotDifficulty.ADVANCED,
      },
    ],
  };
}

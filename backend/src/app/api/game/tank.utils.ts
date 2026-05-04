import { Player } from '../../common/models/player.model';
import { EntryPoint } from '../../common/models/game-map.model';
import { Team } from '../../common/models/team.model';
import { Tank, TankType, TankVariant } from '../../common/models/tank.model';
import { Position } from '../../common/models/position.model';
import { v4 as uuidv4 } from 'uuid';
import { Bot } from '../../common/models/bot.model';
import {
  GameMode,
  GameSettings,
} from '../../common/models/game-settings.model';

export function findTankVariant(tankType: TankType): TankVariant {
  return getAllTankVariants().find((v) => v.tankType === tankType)!;
}

export function getAllTankVariants(): TankVariant[] {
  return [
    getTankPanther(),
    getTankRazor(),
    getTankInferno(),
    getTankReaper(),
    getTankNightShade(),
  ];
}

export function createTanks({
  players,
  gameSettings,
  teams,
  bots,
}: {
  players: Map<string, Player>;
  gameSettings: GameSettings;
  teams: Team[];
  bots: Map<string, Bot>;
}): Map<string, Tank> {
  const tanks = new Map<string, Tank>();
  const map = gameSettings.map;
  const entryPoints =
    (gameSettings.gameMode === GameMode.TeamVsBots ||
      gameSettings.gameMode === GameMode.SinglePlayer) &&
    map.botTeamEntryPoints
      ? map.botTeamEntryPoints
      : map.teamEntryPoints;

  teams.forEach((team, teamIndex) => {
    const teamEntryPoints = entryPoints[teamIndex];

    team.playersIds.forEach((playerId, playerIndex) => {
      const entryPoint = teamEntryPoints.point[playerIndex];
      const player = players.get(playerId);

      if (player) {
        const tankType =
          player.isBot && gameSettings.botSettings
            ? gameSettings.botSettings[playerIndex].tankType
            : gameSettings.tankType;
        const tankVariant = findTankVariant(tankType);
        const tank = createTank(player, team, tankVariant, entryPoint);

        tanks.set(tank.id, tank);
        player.tankId = tank.id;
        team.tankIds.push(tank.id);

        if (player.isBot) {
          const bot = bots.get(player.userId);
          if (bot) bot.tankId = tank.id;
        }
      }
    });
  });

  return tanks;
}

function createTank(
  player: Player,
  team: Team,
  tankVariant: TankVariant,
  entryPoint: EntryPoint,
): Tank {
  const position: Position = {
    ...entryPoint.position,
    y: tankVariant.scale.y / 2,
  };

  return {
    id: uuidv4(),
    playerName: player.name,
    userId: player.userId,
    teamId: player.teamId,
    teamColor: team.color,
    tankVariantId: tankVariant.id,
    bulletVariantId: tankVariant.bulletVariantId,
    modelUrl: tankVariant.modelUrl,
    scale: tankVariant.scale,
    renderScale: tankVariant.renderScale,
    position,
    cameraPosition: entryPoint.cameraPosition,
    crossHair: { x: 0, y: 0, z: 0 },
    speed: tankVariant.speed,
    rotationSpeed: tankVariant.rotationSpeed,
    hp: tankVariant.maxHp,
    maxHp: tankVariant.maxHp,
    maxBullets: tankVariant.maxBullets,
    bulletIds: [],
    isDead: false,
    kills: 0,
    rotation: entryPoint.rotation,
    turretRotation: entryPoint.rotation,
    lastProcessedSeq: 0,
  };
}

function getTankPanther(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.Panther,
    name: 'Panther',
    modelUrl: 'assets/models/TANK-PANTHER-GREEN.glb',
    scale: {
      x: 6,
      y: 4,
      z: 10,
    },
    renderScale: {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    },
    maxHp: 10,
    speed: 14,
    maxBullets: 4,
    rotationSpeed: 15,
    bulletVariantId: 'basicBullet',
  };
}

function getTankRazor(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.Razor,
    name: 'Razor',
    modelUrl: 'assets/models/TANK-PANTHER-GREY.glb',
    scale: {
      x: 6,
      y: 4,
      z: 10,
    },
    renderScale: {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    },
    maxHp: 9,
    speed: 16,
    maxBullets: 5,
    rotationSpeed: 20,
    bulletVariantId: 'basicBullet',
  };
}

function getTankInferno(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.Inferno,
    name: 'Inferno',
    modelUrl: 'assets/models/TANK-PANTHER-RED.glb',
    scale: {
      x: 6,
      y: 4,
      z: 10,
    },
    renderScale: {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    },
    maxHp: 13,
    speed: 12,
    maxBullets: 2,
    rotationSpeed: 14,
    bulletVariantId: 'bouncingBullet',
  };
}

function getTankReaper(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.Reaper,
    name: 'Reaper',
    modelUrl: 'assets/models/TANK-PANTHER-PURPLE.glb',
    scale: {
      x: 6,
      y: 4,
      z: 10,
    },
    renderScale: {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    },
    maxHp: 14,
    speed: 14,
    maxBullets: 3,
    rotationSpeed: 14,
    bulletVariantId: 'rocketBullet',
  };
}

function getTankNightShade(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.Nightshade,
    name: 'Nightshade',
    modelUrl: 'assets/models/TANK-PANTHER-BLACK.glb',
    scale: {
      x: 6,
      y: 4,
      z: 10,
    },
    renderScale: {
      x: 0.5,
      y: 0.5,
      z: 0.5,
    },
    maxHp: 15,
    speed: 18.5,
    maxBullets: 6,
    rotationSpeed: 22,
    bulletVariantId: 'damagingBullet',
  };
}

export function getTankTypeBgColor(tankType: TankType): string {
  switch (tankType) {
    case TankType.Panther:
      return '#0f530f';
    case TankType.Razor:
      return '#8b7d7d';
    case TankType.Inferno:
      return '#700b0b';
    case TankType.Reaper:
      return '#1b0c82';
    case TankType.Nightshade:
      return '#040404';
  }
}

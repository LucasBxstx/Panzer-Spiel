import { Player } from '../../common/models/player.model';
import { EntryPoint } from '../../common/models/game-map.model';
import { Team } from '../../common/models/team.model';
import { Tank, TankType, TankVariant } from '../../common/models/tank.model';
import { Position } from '../../common/models/position.model';
import { v4 as uuidv4 } from 'uuid';
import { Bot } from '../../common/models/bot.model';
import { GameSettings } from '../../common/models/game-settings.model';

export function findTankVariant(tankType: TankType): TankVariant {
  const variants: TankVariant[] = [getBasicTank(), getTacticalTank()];

  return variants.find((v) => v.tankType === tankType)!;
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

  teams.forEach((team, teamIndex) => {
    const teamEntryPoints = gameSettings.map.teamEntryPoints[teamIndex];

    team.playersIds.forEach((playerId, playerIndex) => {
      const entryPoint = teamEntryPoints.point[playerIndex];
      const player = players.get(playerId);

      if (player) {
        const tankVariant = findTankVariant(gameSettings.tankType);
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
    maxBullets: tankVariant.maxBullets,
    bulletIds: [],
    isDead: false,
    kills: 0,
    rotation: entryPoint.rotation,
    turretRotation: entryPoint.rotation,
    lastProcessedSeq: 0,
  };
}

function getBasicTank(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.BasicTank,
    name: 'Basic Tank',
    modelUrl: 'assets/models/tank-panther-centered.glb',
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

function getTacticalTank(): TankVariant {
  return {
    id: uuidv4(),
    tankType: TankType.TacticalTank,
    name: 'Tactical Tank',
    modelUrl: 'assets/models/tank-panther-centered.glb',
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
    speed: 10,
    maxBullets: 2,
    rotationSpeed: 15,
    bulletVariantId: 'bouncingBullet',
  };
}

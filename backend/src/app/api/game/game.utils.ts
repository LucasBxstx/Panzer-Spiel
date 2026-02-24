import { v4 as uuidv4 } from 'uuid';
import { Team } from '../../common/models/team.model';
import { Lobby } from '../../common/models/lobby.model';
import { Tank, TankVariant } from '../../common/models/tank.model';
import { Player } from '../../common/models/player.model';
import { BulletVariant } from '../../common/models/bullet.model';
import { EntryPoint, GameMap } from '../../common/models/game-map.model';
import { Position } from '../../common/models/position.model';

export function getPlayers(lobby: Lobby): Map<string, Player> {
  return new Map<string, Player>(
    lobby.players.map((p) => [
      p.userId,
      {
        ...p,
        isConnected: false,
        teamId: '',
        tankId: '',
        isRejoining: false,
      },
    ]),
  );
}

export function createTeams(
  lobby: Lobby,
  players: Player[],
): Map<string, Team> {
  const teamNames = ['black', 'red', 'blue', 'yellow'];
  const teams: Map<string, Team> = new Map();

  for (let i = 1; i <= lobby.gameSettings.numberOfTeams; i++) {
    const teamId = uuidv4();
    const playersIds: string[] = [];

    for (let j = 1; j <= lobby.gameSettings.teamSize; j++) {
      const player = players[i * j - 1];
      player.teamId = teamId;
      playersIds.push(player.userId);
    }

    teams.set(teamId, {
      id: teamId,
      name: teamNames[i - 1],
      playersIds,
      tankIds: [],
    });
  }

  return teams;
}

export function createTanks(
  players: Map<string, Player>,
  map: GameMap,
  teams: Team[],
): Map<string, Tank> {
  const tanks = new Map<string, Tank>();

  teams.forEach((team, teamIndex) => {
    const teamEntryPoints = map.teamEntryPoints[teamIndex];

    team.playersIds.forEach((playerId, playerIndex) => {
      const entryPoint = teamEntryPoints.point[playerIndex];
      const player = players.get(playerId);

      if (player) {
        const tank = createTank(player, getBasicTank(), entryPoint);
        tanks.set(tank.id, tank);
        player.tankId = tank.id;
        team.tankIds.push(tank.id);
      }
    });
  });

  return tanks;
}

function createTank(
  player: Player,
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
    tankVariantId: tankVariant.id,
    modelUrl: tankVariant.modelUrl,
    scale: tankVariant.scale,
    renderScale: tankVariant.renderScale,
    position,
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
    name: 'BasicTank',
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
    speed: 0.4,
    maxBullets: 5,
    rotationSpeed: 0.3,
  };
}

export function getBasicBullet(): BulletVariant {
  return {
    id: uuidv4(),
    name: 'BasicBullet',
    speed: 1,
    damage: 10,
    maxBounceCount: 0,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
    modelUrl: 'assets/models/tank_bullet.glb',
  };
}

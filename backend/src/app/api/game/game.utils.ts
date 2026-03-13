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
  const teamNames = [
    'Purple',
    'Red',
    'Blue',
    'Yellow',
    'Green',
    'Orange',
    'Teal',
    'Pink',
    'Indigo',
    'Brown',
    'Cyan',
    'Lime',
  ];
  const colors = [
    '#8E24AA', // Purple
    '#D32F2F', // Red
    '#1976D2', // Blue
    '#FBC02D', // Yellow
    '#388E3C', // Green
    '#F57C00', // Orange
    '#00796B', // Teal
    '#C2185B', // Pink
    '#303F9F', // Indigo
    '#5D4037', // Brown
    '#0097A7', // Cyan
    '#689F38', // Lime
  ];
  const teams: Map<string, Team> = new Map();

  for (let i = 0; i < lobby.gameSettings.numberOfTeams; i++) {
    const teamId = uuidv4();
    const playersIds: string[] = [];

    for (let j = 0; j < lobby.gameSettings.teamSize; j++) {
      const player = players[i * lobby.gameSettings.teamSize + j];
      player.teamId = teamId;
      playersIds.push(player.userId);
    }

    teams.set(teamId, {
      id: teamId,
      name: teamNames[i],
      color: colors[i],
      playersIds,
      tankIds: [],
    });
  }
  console.log('Created following teams', teams);
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
        const tank = createTank(player, team, getBasicTank(), entryPoint);
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
    speed: 14,
    maxBullets: 4,
    rotationSpeed: 15,
  };
}

export function getBasicBullet(): BulletVariant {
  return {
    id: uuidv4(),
    name: 'BasicBullet',
    speed: 1.2,
    damage: 2,
    maxBounceCount: 2,
    scale: { x: 1, y: 1, z: 1 },
    renderScale: { x: 1, y: 1, z: 1 },
  };
}

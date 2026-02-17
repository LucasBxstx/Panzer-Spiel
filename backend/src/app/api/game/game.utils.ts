import {
  BulletVariant,
  GameMap,
  Lobby,
  Player,
  Tank,
  TankVariant,
  Team,
} from '../../common/interfaces/game.interfaces';
import { v4 as uuidv4 } from 'uuid';

export function createTeams(lobby: Lobby): Team[] {
  const teamNames = ['black', 'red', 'blue', 'yellow'];
  const teams: Team[] = [];

  for (let i = 0; i < lobby.gameSettings.numberOfTeams; i++) {
    const teamId = uuidv4();
    const playersIds: string[] = [];

    for (let j = 0; j < lobby.gameSettings.teamSize; j++) {
      const player = lobby.players[(i + 1) * j];
      playersIds.push(player.userId);
      player.teamId = teamId;
    }

    teams.push({
      id: teamId,
      name: teamNames[i],
      playersIds,
      tankIds: [],
    });
  }

  return teams;
}

export function createTanks(lobby: Lobby, teams: Team[]): Tank[] {
  return lobby.players.map((player) => {
    const tank = createTank(player, getBasicTank());
    player.tankId = tank.id;

    return tank;
  });
}

function createTank(player: Player, tankVariant: TankVariant): Tank {
  return {
    id: uuidv4(),
    playerName: player.name,
    userId: player.userId,
    teamId: player.teamId!,
    tankVariantId: tankVariant.id,
    scale: tankVariant.scale,
    position: { x: 0, y: 0 },
    crossHair: { x: 0, y: 0 },
    speed: tankVariant.speed,
    rotationSpeed: tankVariant.rotationSpeed,
    hp: tankVariant.maxHp,
    maxBullets: tankVariant.maxBullets,
    bulletIds: [],
    isDead: false,
    kills: 0,
    rotation: 0,
  };
}

function getBasicTank(): TankVariant {
  return {
    id: uuidv4(),
    name: 'BasicTank',
    scale: {
      x: 0.4,
      y: 0.4,
    },
    maxHp: 10,
    speed: 0.1,
    maxBullets: 5,
    rotationSpeed: 0.15,
  };
}

function getBasicBullet(): BulletVariant {
  return {
    id: uuidv4(),
    name: 'BasicBullet',
    speed: 10,
    damage: 10,
    maxBounceCount: 0,
  };
}

export function getBasicMap(): GameMap {
  return {
    id: uuidv4(),
    name: 'Desert',
    pictureUrl: 'assets/pictures/map-desert.png',
    teamEntryPoints: [
      {
        team: 1,
        positions: [
          {
            x: 10,
            y: 10,
          },
        ],
      },
      {
        team: 2,
        positions: [
          {
            x: 30,
            y: 30,
          },
        ],
      },
    ],
    obstacles: [
      {
        id: '1',
        name: 'Wall',
        position: {
          x: 20,
          y: 20,
        },
        scale: {
          x: 20,
          y: 20,
        },
        renderScale: {
          x: 20,
          y: 20,
        },
      },
    ],
  };
}

import { v4 as uuidv4 } from 'uuid';
import { Team } from '../../common/models/team.model';
import { Lobby } from '../../common/models/lobby.model';
import { Tank, TankVariant } from '../../common/models/tank.model';
import { Player } from '../../common/models/player.model';
import { BulletVariant } from '../../common/models/bullet.model';
import { EntryPoint, GameMap } from '../../common/models/game-map.model';
import { Texture } from '../../common/models/texture.model';

export function getPlayers(lobby: Lobby): Map<string, Player> {
  return new Map<string, Player>(
    lobby.players.map((p) => [
      p.userId,
      {
        ...p,
        isConnected: false,
        teamId: '',
        tankId: '',
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

  console.log(players[0], players[1]);

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
        player.tankId = tank.id;
        tanks.set(tank.id, tank);
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
  return {
    id: uuidv4(),
    playerName: player.name,
    userId: player.userId,
    teamId: player.teamId,
    tankVariantId: tankVariant.id,
    modelUrl: tankVariant.modelUrl,
    scale: tankVariant.scale,
    renderScale: tankVariant.renderScale,
    position: { ...entryPoint.position },
    crossHair: { x: 0, y: 0, z: 0 },
    speed: tankVariant.speed,
    rotationSpeed: tankVariant.rotationSpeed,
    hp: tankVariant.maxHp,
    maxBullets: tankVariant.maxBullets,
    bulletIds: [],
    isDead: false,
    kills: 0,
    rotation: entryPoint.rotation,
  };
}

function getBasicTank(): TankVariant {
  return {
    id: uuidv4(),
    name: 'BasicTank',
    modelUrl: 'assets/models/tank-panther-split.glb',
    scale: {
      x: 10,
      y: 10,
      z: 10,
    },
    renderScale: {
      x: 0.4,
      y: 0.4,
      z: 0.4,
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
    scale: { x: 2, y: 2, z: 2 },
    renderScale: { x: 1, y: 1, z: 1 },
    modelUrl: 'not given yet',
  };
}

export function getBasicMap(): GameMap {
  return {
    id: uuidv4(),
    name: 'Desert',
    pictureUrl: 'assets/pictures/map-desert.png',
    scale: {
      x: 100,
      y: 100,
      z: 100,
    },
    groundTexture: {
      id: uuidv4(),
      name: 'sandstone-cracks',
      diffuseImageUrl: 'assets/textures/sandstone_cracks_diff_1k.jpg',
      normalImageUrl: 'assets/textures/sandstone_cracks_nor_gl_1k.png',
      roughnessImageUrl: 'assets/textures/sandstone_cracks_rough_1k.jpg',
      repeat: {
        x: 2,
        y: 2,
      },
    },
    teamEntryPoints: [
      {
        team: 1,
        point: [
          {
            position: {
              x: -40,
              y: 0,
              z: -40,
            },
            rotation: 2 * Math.PI,
          },
        ],
      },
      {
        team: 2,
        point: [
          {
            position: {
              x: 40,
              y: 0,
              z: 40,
            },
            rotation: Math.PI,
          },
        ],
      },
    ],
    obstacles: [
      {
        id: '1',
        name: 'Wall',
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: {
          x: 20,
          y: 20,
          z: 30,
        },
        renderScale: {
          x: 20,
          y: 20,
          z: 30,
        },
        texture: getBrickTexture(),
      },
    ],
  };
}

export function getBrickTexture(): Texture {
  return {
    id: uuidv4(),
    name: 'Brick',
    diffuseImageUrl: 'assets/textures/broken_brick_wall_diff_1k.jpg',
    normalImageUrl: 'assets/textures/broken_brick_wall_nor_gl_1k.png',
    roughnessImageUrl: 'assets/textures/broken_brick_wall_rough_1k.jpg',
    repeat: { x: 5, y: 1 },
  };
}

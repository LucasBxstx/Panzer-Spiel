export interface Lobby {
  id: string;
  hostUserId: string;
  hostUserName: string;
  players: Player[];
  gameSettings: GameSettings;
  createdAt: Date;
}

export interface Player {
  userId: string;
  name: string;
  socketId: string;
  teamId?: string;
  tankId?: string;
}

export interface GameSettings {
  gameMode: GameMode;
  map: GameMap;
  maxPlayersCount: number;
  numberOfTeams: number;
  teamSize: number;
}

export enum GameMode {
  OneVsOne = 'OneVsOne',
  TeamVsTeam = 'TeamVsTeam',
  TeamVsBots = 'TeamVsBots',
}

export interface GameMap {
  id: string;
  name: string;
  pictureUrl: string;
  obstacles: Obstacle[];
  teamEntryPoints: TeamEntryPoints[];
}

export interface Obstacle {
  id: string;
  name: string;
  position: Position;
  scale: Scale;
}

export interface TeamEntryPoints {
  team: number;
  positions: Position[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Scale {
  x: number;
  y: number;
}

export interface Game {
  id: string;
  gameSettings: GameSettings;
  players: Player[];
  teams: Team[];
  tanks: Tank[];
  bullets: Bullet[];
  startingAt: Date;
}

export interface Team {
  id: string;
  name: string;
  playersIds: string[];
  tankIds: string[];
}

export interface Tank {
  id: string;
  playerName: string;
  userId: string;
  teamId: string;
  position: Position;
  scale: Scale;
  tankVariantId: string;
  hp: number;
  speed: number;
  maxBullets: number;
  bulletIds: string[];
  kills: number;
  isDead: boolean;
  rotation: number;
  crossHair: Position;
}

export interface Bullet {
  id: string;
  name: string;
  tankId: string;
  speed: number;
  damage: number;
  maxBounceCount: number;
  bounceCount: number;
}

export interface TankVariant {
  id: string;
  name: string;
  scale: Scale;
  speed: number;
  maxHp: number;
  maxBullets: number;
}

export interface BulletVariant {
  id: string;
  name: string;
  speed: number;
  damage: number;
  maxBounceCount: number;
}

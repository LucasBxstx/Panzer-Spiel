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
  team?: Team;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
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

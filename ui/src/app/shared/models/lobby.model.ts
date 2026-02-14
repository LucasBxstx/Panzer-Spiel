import { GameMode } from './lobby-preview.model';

export interface CreateLobbyRequest {
  mapId: string;
  gameMode: GameMode;
  maxPlayersCount: number;
  teamSize: number;
  numberOfTeams: number;
}

export interface MapPreviewResponse {
  id: string;
  name: string;
  pictureUrl: string;
}

export interface LobbyResponse {
  id: string;
  hostUserName: string;
  map: MapPreviewResponse;
  gameMode: GameModeOption;
  maxPlayersCount: number;
  teamSize: number;
  numberOfTeams: number;
  joinedPlayers: PlayerPreviewResponse[];
}

export interface PlayerPreviewResponse {
  userId: string;
  name: string;
}

export interface GameModeOption {
  name: string;
  value: GameMode;
}

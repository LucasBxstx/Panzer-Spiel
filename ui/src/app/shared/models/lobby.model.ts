import { GameMode } from './lobby-preview.model';

export interface CreateLobbyRequest {
  mapId: string;
  gameMode: GameMode;
  hostUserId: string;
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
  gameMode: GameMode;
  maxPlayersCount: number;
  joinedPlayers: PlayerPreviewResponse[];
}

export interface PlayerPreviewResponse {
  userId: string;
  name: string;
}

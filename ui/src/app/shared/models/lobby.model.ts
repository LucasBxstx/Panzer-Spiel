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
  maxTeamCount: number;
  maxTeamSize: number;
}

export interface LobbyResponse {
  id: string;
  hostUserName: string;
  gameSettings: GameSettingsResponse;
  joinedPlayers: PlayerPreviewResponse[];
}

export interface CreateGameResponse {
  gameId: string;
}

export interface GameSettingsResponse {
  gameModeOption: GameModeOption;
  mapPreview: MapPreviewResponse;
  maxPlayersCount: number;
  numberOfTeams: number;
  teamSize: number;
}

export interface PlayerPreviewResponse {
  userId: string;
  name: string;
}

export interface GameModeOption {
  name: string;
  value: GameMode;
}

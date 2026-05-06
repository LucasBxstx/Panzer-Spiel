import { GameMode } from './lobby-preview.model';
import { BotDifficulty } from './bot.model';
import { TankType } from './tank.model';
import { MultiplayerGameType } from './game.model';
import { SelectableTankVariantResponse } from './level.model';

export interface CreateLobbyRequest {
  mapId: string;
  gameMode: GameMode;
  maxPlayersCount: number;
  teamSize: number;
  numberOfBots: number;
  numberOfTeams: number;
  tankType: TankType;
  botDifficulty?: BotDifficulty;
}

export interface LobbyCreationOptionsResponseDto {
  mapPreviews: MapPreviewResponse[];
  selectableTanks: SelectableTankVariantResponse[];
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

export interface BotDifficultyOption {
  name: string;
  value: BotDifficulty;
}

export interface TankTypeOption {
  name: string;
  value: TankType;
}

export interface GameTypeOption {
  name: string;
  value: MultiplayerGameType;
}

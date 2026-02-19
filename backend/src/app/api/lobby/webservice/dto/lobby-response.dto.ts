import { Expose, Type } from 'class-transformer';
import { Lobby } from '../../../../common/models/lobby.model';
import { PlayerPreviewResponseDto } from '../../../../common/dtos/player-preview-response.dto';
import { GameSettingsResponseDto } from '../../../../common/dtos/game-settings-response.dto';
import { GameModeOptionResponseDto } from '../../../../common/dtos/game-mode-option-response.dto';

export class LobbyPreviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  hostUserName: string;

  @Expose()
  playersCount: number;

  @Expose()
  maxPlayersCount: number;

  @Expose()
  mapName: string;

  @Expose()
  @Type(() => GameModeOptionResponseDto)
  gameMode: GameModeOptionResponseDto;

  static mapFromEntity(lobby: Lobby): LobbyPreviewResponseDto {
    return {
      id: lobby.id,
      hostUserName: lobby.hostUserName,
      mapName: lobby.gameSettings.map.name,
      gameMode: GameModeOptionResponseDto.mapFromEntity(
        lobby.gameSettings.gameMode,
      ),
      playersCount: lobby.players.length,
      maxPlayersCount: lobby.gameSettings.maxPlayersCount,
    };
  }
}

export class LobbyResponseDto {
  @Expose()
  id: string;

  @Expose()
  hostUserName: string;

  @Expose()
  @Type(() => GameSettingsResponseDto)
  gameSettings: GameSettingsResponseDto;

  @Expose()
  @Type(() => PlayerPreviewResponseDto)
  joinedPlayers: PlayerPreviewResponseDto[];

  static mapFromEntity(lobby: Lobby): LobbyResponseDto {
    return {
      id: lobby.id,
      hostUserName: lobby.hostUserName,
      gameSettings: GameSettingsResponseDto.mapFromEntity(lobby.gameSettings),
      joinedPlayers: lobby.players.map((p) =>
        PlayerPreviewResponseDto.mapFromEntity(p),
      ),
    };
  }
}

export class CreateGameResponseDto {
  @Expose()
  gameId: string;
}

import { Expose, Type } from 'class-transformer';
import {
  GameMap,
  GameMode,
  GameSettings,
  Lobby,
  Player,
} from '../../../../common/interfaces/game.interfaces';

export class MapPreviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  pictureUrl: string;

  static mapFromEntity(map: GameMap): MapPreviewResponseDto {
    return {
      id: map.id,
      name: map.name,
      pictureUrl: map.pictureUrl,
    };
  }
}

export class GameModeOptionResponseDto {
  @Expose()
  name: string;

  @Expose()
  value: GameMode;

  static mapFromEntity(gameMode: GameMode): GameModeOptionResponseDto {
    return {
      name: this.getGameModeName(gameMode),
      value: gameMode,
    };
  }

  static getGameModeName(gameMode: GameMode): string {
    switch (gameMode) {
      case GameMode.OneVsOne:
        return '1 vs 1';
      case GameMode.TeamVsTeam:
        return 'Team vs Team';
      case GameMode.TeamVsBots:
        return 'Team vs Bots';
      default:
        return 'undefined';
    }
  }
}

export class PlayerPreviewResponseDto {
  @Expose()
  userId: string;

  @Expose()
  name: string;

  static mapFromEntity(player: Player): PlayerPreviewResponseDto {
    return {
      userId: player.userId,
      name: player.name,
    };
  }
}

export class GameSettingsResponseDto {
  @Expose()
  @Type(() => GameModeOptionResponseDto)
  gameModeOption: GameModeOptionResponseDto;

  @Expose()
  @Type(() => MapPreviewResponseDto)
  mapPreview: MapPreviewResponseDto;

  @Expose()
  maxPlayersCount: number;

  @Expose()
  numberOfTeams: number;

  @Expose()
  teamSize: number;

  static mapFromEntity(settings: GameSettings): GameSettingsResponseDto {
    return {
      gameModeOption: GameModeOptionResponseDto.mapFromEntity(
        settings.gameMode,
      ),
      mapPreview: MapPreviewResponseDto.mapFromEntity(settings.map),
      maxPlayersCount: settings.maxPlayersCount,
      teamSize: settings.teamSize,
      numberOfTeams: settings.numberOfTeams,
    };
  }
}

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

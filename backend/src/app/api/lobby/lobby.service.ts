import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { CreateLobbyDto } from './webservice/dto/lobby.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  LobbyPreviewResponseDto,
  LobbyResponseDto,
} from './webservice/dto/lobby-response.dto';
import { WsException } from '@nestjs/websockets';
import {
  GameMode,
  GameSettings,
} from '../../common/models/game-settings.model';
import { Lobby } from '../../common/models/lobby.model';
import { LobbyPlayer } from '../../common/models/player.model';
import { MapPreviewResponseDto } from '../../common/dtos/map-preview-response.dto';
import { findMap, getAllMaps } from '../game/maps/map.utils';
import { BotDifficulty, BotSetting } from '../../common/models/bot.model';
import { LobbyCreationOptionsResponseDto } from '../../common/dtos/lobby-creation-option-response.dto';
import {
  LevelPreviewResponseDto,
  SelectableTankVariantResponseDto,
} from '../level/webservice/dto/level-response.dto';
import { getAllTankVariants } from '../game/tank.utils';
import { findLevel, getAllLevels } from '../level/levels/level.utils';

@Injectable()
export class LobbyService {
  private lobbies: Map<string, Lobby> = new Map();

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  getLobbyCreationOptions(): LobbyCreationOptionsResponseDto {
    const maps = getAllMaps();
    const mapPreviews = maps.map((m) => MapPreviewResponseDto.mapFromEntity(m));

    const selectableTanks = getAllTankVariants().map((v) =>
      SelectableTankVariantResponseDto.mapToDto(v),
    );

    const allLevels = getAllLevels();
    const levelPreviews = allLevels.map((l) =>
      LevelPreviewResponseDto.mapFromEntity(l),
    );

    return new LobbyCreationOptionsResponseDto(
      mapPreviews,
      selectableTanks,
      levelPreviews,
    );
  }

  async createLobby(
    userId: string,
    dto: CreateLobbyDto,
    player: LobbyPlayer,
  ): Promise<Lobby> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new WsException('Unauthorized');
    }

    let mapId: string;
    let maxPlayersCount: number;
    let botSettings: BotSetting[] = [];

    if (dto.gameMode === GameMode.TeamLevel) {
      if (!dto.levelId) throw new WsException('Invalid Level Id');

      const level = findLevel(dto.levelId);

      if (!level) throw new WsException('No such level exists');

      mapId = level.mapId;
      maxPlayersCount = dto.teamSize;
      botSettings = level.botSettings;
    } else {
      mapId = dto.mapId;
      maxPlayersCount = dto.maxPlayersCount;

      for (let i = 0; i < dto.numberOfBots; i++) {
        botSettings.push({
          tankType: dto.tankType,
          difficulty: dto.botDifficulty ?? BotDifficulty.EASY,
        });
      }
    }

    const map = findMap(mapId);

    if (!map) {
      throw new WsException('Map not found');
    }

    const gameSettings: GameSettings = {
      map,
      teamSize: dto.teamSize,
      numberOfTeams: dto.numberOfTeams,
      gameMode: dto.gameMode,
      maxPlayersCount,
      numberOfBots: botSettings.length,
      botSettings,
      tankType: dto.tankType,
    };

    const lobby: Lobby = {
      id: uuidv4(),
      hostUserId: userId,
      hostUserName: user.name,
      players: [player],
      gameSettings,
      createdAt: new Date(),
    };

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  async findAll(userId: string): Promise<LobbyPreviewResponseDto[]> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const lobbies = Array.from(this.lobbies.values()).filter(
      (l) => l.players.length < l.gameSettings.maxPlayersCount,
    );

    return lobbies.map((l) => LobbyPreviewResponseDto.mapFromEntity(l));
  }

  async joinLobby(
    userId: string,
    lobbyId: string,
    player: LobbyPlayer,
  ): Promise<Lobby> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new WsException('Unauthorized');
    }

    const lobby = Array.from(this.lobbies.values()).find(
      (l) => l.id === lobbyId,
    );

    if (!lobby) {
      throw new WsException('Lobby not found');
    }

    if (lobby.players.length >= lobby.gameSettings.maxPlayersCount) {
      throw new WsException('Too many players. Cannot join');
    }

    if (lobby.players.find((p) => p.userId === player.userId)) {
      throw new WsException('Player already joined');
    }

    lobby.players.push(player);

    return lobby;
  }

  async leaveLobby(
    userId: string,
    lobbyId: string,
  ): Promise<LobbyResponseDto | null> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new WsException('Unauthorized');
    }

    const lobby = Array.from(this.lobbies.values()).find(
      (l) => l.id === lobbyId,
    );

    if (!lobby) {
      throw new WsException('Lobby not found');
    }

    if (userId === lobby.hostUserId && lobby.players.length > 1) {
      const nextPlayer = lobby.players.find((p) => p.userId !== userId)!;
      lobby.hostUserId = nextPlayer.userId;
      lobby.hostUserName = nextPlayer.name;
    }

    const playerIndex = lobby.players.findIndex((p) => p.userId === userId);
    if (playerIndex >= 0) {
      lobby.players.splice(playerIndex, 1);
    }

    if (lobby.players.length === 0) {
      this.lobbies.delete(lobbyId);
      return null;
    }

    return LobbyResponseDto.mapFromEntity(lobby);
  }
}

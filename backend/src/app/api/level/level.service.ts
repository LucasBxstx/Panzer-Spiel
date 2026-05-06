import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import {
  LevelPreviewResponseDto,
  LevelResponseDto,
  StartLevelResponseDto,
} from './webservice/dto/level-response.dto';
import { findLevel, getAllLevels } from './levels/level.utils';
import { GameService } from '../game/game.service';
import { Lobby } from '../../common/models/lobby.model';
import { v4 as uuidv4 } from 'uuid';
import { findMap } from '../game/maps/map.utils';
import { GameMode } from '../../common/models/game-settings.model';
import { PlayLevelDto } from './webservice/dto/level.dto';

@Injectable()
export class LevelService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,

    @Inject(GameService)
    private readonly gameService: GameService,
  ) {}

  async getAllLevelPreviews(
    userId: string,
  ): Promise<LevelPreviewResponseDto[]> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const allLevels = getAllLevels();

    return allLevels.map((l) => LevelPreviewResponseDto.mapFromEntity(l));
  }

  async getLevel(levelId: number, userId: string): Promise<LevelResponseDto> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const level = findLevel(levelId);

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    return LevelResponseDto.mapFromEntity(level);
  }

  async startLevel(
    levelId: number,
    userId: string,
    playLevelDto: PlayLevelDto,
  ): Promise<StartLevelResponseDto> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const level = findLevel(levelId);

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    const map = findMap(level.mapId);

    if (!map) {
      throw new NotFoundException('Map not found');
    }

    const fakeLobby: Lobby = {
      id: uuidv4(),
      hostUserName: user.name,
      hostUserId: user.id,
      players: [
        { userId: user.id, name: user.name, isConnected: true, socketId: '' },
      ],
      gameSettings: {
        map,
        gameMode: GameMode.SinglePlayer,
        tankType: playLevelDto.selectedTankType,
        numberOfBots: level.botSettings.length,
        botSettings: level.botSettings,
        maxPlayersCount: level.botSettings.length + 1,
        teamSize: 1,
        numberOfTeams: 2,
      },
      createdAt: new Date(),
    };

    const gameId = this.gameService.createGame(fakeLobby);

    return StartLevelResponseDto.mapToDto(gameId);
  }
}

import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import {
  GameMap,
  GameSettings,
  Lobby,
  Player,
} from '../../common/interfaces/game.interfaces';
import { CreateLobbyDto } from './webservice/dto/lobby.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  LobbyPreviewResponseDto,
  LobbyResponseDto,
} from './webservice/dto/lobby-response.dto';

@Injectable()
export class LobbyService {
  private lobbies: Map<string, Lobby> = new Map();

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,

    @Inject(EntityManager)
    private readonly entityManager: EntityManager<PostgreSqlDriver>,
  ) {}

  async createLobby(
    userId: string,
    dto: CreateLobbyDto,
  ): Promise<LobbyResponseDto> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    // const map = await this.mapRepository...
    const map: GameMap = {
      id: uuidv4(),
      name: 'Desert',
      pictureUrl: 'assets/pictures/map-desert.png',
      teamEntryPoints: [
        {
          team: 1,
          positions: [
            {
              x: 10,
              y: 10,
            },
          ],
        },
        {
          team: 2,
          positions: [
            {
              x: 30,
              y: 30,
            },
          ],
        },
      ],
      obstacles: [
        {
          id: '1',
          name: 'Wall',
          position: {
            x: 20,
            y: 20,
          },
          scale: {
            x: 20,
            y: 20,
          },
        },
      ],
    };

    if (!map) {
      throw new NotFoundException('Map not found');
    }

    const gameSettings: GameSettings = {
      map,
      teamSize: dto.teamSize,
      numberOfTeams: dto.numberOfTeams,
      gameMode: dto.gameMode,
      maxPlayersCount: dto.maxPlayersCount,
    };

    const lobby: Lobby = {
      id: uuidv4(),
      hostUserId: userId,
      hostUserName: user.name,
      players: [],
      gameSettings,
      createdAt: new Date(),
    };

    this.lobbies.set(lobby.id, lobby);

    return LobbyResponseDto.mapFromEntity(lobby);
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
    player: Player,
  ): Promise<LobbyResponseDto> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const lobby = Array.from(this.lobbies.values()).find(
      (l) => l.id === lobbyId,
    );

    if (!lobby) {
      throw new NotFoundException('Lobby does not exist');
    }

    lobby.players.push(player);

    if (lobby.players.length === lobby.gameSettings.maxPlayersCount) {
      // start game
    }

    return LobbyResponseDto.mapFromEntity(lobby);
  }

  async leaveLobby(
    userId: string,
    lobbyId: string,
  ): Promise<LobbyResponseDto | null> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const lobby = Array.from(this.lobbies.values()).find(
      (l) => l.id === lobbyId,
    );

    if (!lobby) {
      throw new NotFoundException('Lobby does not exist');
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

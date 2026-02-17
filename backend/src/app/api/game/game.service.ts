import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuidv4 } from 'uuid';
import { createTanks, createTeams, getPlayers } from './game.utils';
import { Game } from '../../common/models/game.model';
import { Lobby } from '../../common/models/lobby.model';
import { JoinGameDto } from './webservice/dto/game.dto';
import { GameStateResponseDto } from './webservice/dto/game-response.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,

    @Inject(EntityManager)
    private readonly entityManager: EntityManager<PostgreSqlDriver>,
  ) {}

  createGame(lobby: Lobby): string {
    const players = getPlayers(lobby);
    const playersArray = Array.from(players.values());
    const teams = createTeams(lobby, playersArray);
    const teamsArray = Array.from(teams.values());
    const tanks = createTanks(players, lobby.gameSettings.map, teamsArray);

    const game: Game = {
      id: uuidv4(),
      startingAt: new Date(Date.now() + 20 * 1000),
      gameSettings: lobby.gameSettings,
      players,
      teams,
      tanks,
      bullets: new Map(),
    };

    this.games.set(game.id, game);

    return game.id;
  }

  async joinGame(
    userId: string,
    dto: JoinGameDto,
  ): Promise<GameStateResponseDto> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new WsException('User not found');
    }

    const game = this.games.get(dto.gameId);

    if (!game) {
      throw new WsException('Game not found');
    }

    const player = game.players.get(userId);

    if (!player) {
      throw new WsException('User is not part of this Game');
    }

    player.isConnected = true;

    return GameStateResponseDto.mapFromEntity(game);
  }
}

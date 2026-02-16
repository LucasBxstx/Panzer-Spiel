import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Game, Lobby } from '../../common/interfaces/game.interfaces';
import { v4 as uuidv4 } from 'uuid';
import { createTanks, createTeams } from './game.utils';

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
    const teams = createTeams(lobby);
    const tanks = createTanks(lobby, teams);

    const game: Game = {
      id: uuidv4(),
      startingAt: new Date(Date.now() + 20 * 1000),
      players: lobby.players,
      gameSettings: lobby.gameSettings,
      teams,
      tanks,
      bullets: [],
    };

    this.games.set(game.id, game);

    return game.id;
  }
}

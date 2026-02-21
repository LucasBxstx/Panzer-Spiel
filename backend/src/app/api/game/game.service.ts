import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { v4 as uuidv4 } from 'uuid';
import { createTanks, createTeams, getPlayers } from './game.utils';
import { Game } from '../../common/models/game.model';
import { Lobby } from '../../common/models/lobby.model';
import { JoinGameDto } from './webservice/dto/join-game.dto';
import {
  GameStateResponseDto,
  InitialGameStateResponseDto,
} from './webservice/dto/game-state-response.dto';
import { WsException } from '@nestjs/websockets';
import { UpdateTankPositionDto } from './webservice/dto/update-tank-position.dto';
import { calculateTankMovement } from './update-tank-position.utils';
import {
  UpdateTankPositionResponseDto,
  UpdateTurretRotationResponseDto,
} from './webservice/dto/update-tank-response.dto';
import { Server } from 'socket.io';
import { UpdateTurretRotationDto } from './webservice/dto/update-turret-rotation.dto';
import { tankCollidesObstacle } from './collision';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();
  private gameLoops: Map<string, NodeJS.Timeout> = new Map();

  private server?: Server;
  private logger = new Logger(GameService.name);

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,

    @Inject(EntityManager)
    private readonly entityManager: EntityManager<PostgreSqlDriver>,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

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
    this.startGameLoop(game.id);

    return game.id;
  }

  async joinGame(
    userId: string,
    dto: JoinGameDto,
  ): Promise<InitialGameStateResponseDto> {
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

    return InitialGameStateResponseDto.mapFromEntity(game, player.tankId);
  }

  private startGameLoop(gameId: string) {
    const interval = setInterval(() => {
      this.broadcastGameState(gameId);
    }, 50);

    this.gameLoops.set(gameId, interval);
    this.logger.log('Starting game loop for game: ' + gameId);
  }

  private broadcastGameState(gameId: string) {
    const game = this.games.get(gameId);
    if (!game || !this.server) return;

    const stateUpdate = GameStateResponseDto.mapFromEntity(game);

    this.server.to(gameId).emit('stateUpdate', stateUpdate);
    // this.logger.log(`Gamestate was broadcasted for game ${gameId}`);
  }

  stopGame(gameId: string) {
    const loop = this.gameLoops.get(gameId);
    if (loop) {
      clearInterval(loop);
      this.gameLoops.delete(gameId);
    }
    this.games.delete(gameId);
    this.logger.log(`Game ${gameId} was stopped`);
  }

  updateTankPosition(
    userId: string,
    gameId: string,
    dto: UpdateTankPositionDto,
  ): UpdateTankPositionResponseDto {
    const game = this.games.get(gameId);

    if (!game) {
      throw new WsException('Game not found');
    }

    const player = game.players.get(userId);

    if (!player) {
      throw new WsException('Player not found');
    }

    const tank = game.tanks.get(player.tankId);

    if (!tank) {
      throw new WsException('Tank not found');
    }

    const obstacles = game.gameSettings.map.obstacles;

    const tankMovement = calculateTankMovement(tank, dto.input, dto.deltaTime);
    const collides = tankCollidesObstacle(tank, tankMovement, obstacles);

    if (true) {
      tank.position = tankMovement.position;
      tank.rotation = tankMovement.rotation.y;
    }

    // this.logger.log(`Position for tank ${tank.id} was updated`);

    return { success: true };
  }

  updateTurretRotation(
    userId: string,
    gameId: string,
    dto: UpdateTurretRotationDto,
  ): UpdateTurretRotationResponseDto {
    const game = this.games.get(gameId);

    if (!game) {
      throw new WsException('Game not found');
    }

    const player = game.players.get(userId);

    if (!player) {
      throw new WsException('Player not found');
    }

    const tank = game.tanks.get(player.tankId);

    if (!tank) {
      throw new WsException('Tank not found');
    }

    tank.turretRotation = dto.rotation;

    // this.logger.log(`Turret rotation for tank ${tank.id} was updated`);

    return { success: true };
  }
}

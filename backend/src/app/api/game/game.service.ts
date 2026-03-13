import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { createTeams, getPlayers } from './game.utils';
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
  FireBulletResponseDto,
  GameOverResponseDto,
  LeaveGameResponseDto,
  UpdateTankPositionResponseDto,
  UpdateTurretRotationResponseDto,
} from './webservice/dto/game-response.dto';
import { Server } from 'socket.io';
import { UpdateTurretRotationDto } from './webservice/dto/update-turret-rotation.dto';
import { tankCollidesObstacle, tankCollidesTank } from './collision';
import { FireBulletDto } from './webservice/dto/fire-bullet.dto';
import { Bullet } from '../../common/models/bullet.model';
import { removeBullet, updateGameState } from './update-game-state';
import { isGameOver } from './isGameOver';
import { calculateBulletStartingPosition } from './calculate-bullet-starting-position';
import { tankOutOfMap } from './out-of-map';
import { LobbyPreviewResponseDto } from '../lobby/webservice/dto/lobby-response.dto';
import { createTanks } from './tank.utils';
import { findBulletVariant } from './bullet.utils';

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();
  private gameLoops: Map<string, NodeJS.Timeout> = new Map();

  private server?: Server;
  private logger = new Logger(GameService.name);

  constructor(
    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,
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
      hostUserName: lobby.hostUserName,
      startingAt: new Date(Date.now() + 15 * 1000),
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
    player.isRejoining = false;

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

    const gameAlreadyStarted =
      new Date().getTime() >= game.startingAt.getTime();

    updateGameState(game);

    const stateUpdate = GameStateResponseDto.mapFromEntity(game);

    this.server.to(gameId).emit('stateUpdate', stateUpdate);
    // this.logger.log(`Gamestate was broadcasted for game ${gameId}`);

    if (!gameAlreadyStarted) {
      return;
    }

    if (!game.winningTeamId && isGameOver(game)) {
      const gameOverDto: GameOverResponseDto = {
        winningTeamId: game.winningTeamId!,
      };
      this.server.to(gameId).emit('gameOver', gameOverDto);
      this.logger.log(`Game is over - Team ${game.winningTeamId!} has won`);
    }

    const noPlayerInGame = Array.from(game.players.values()).every(
      (player) => player.isRejoining || !player.isConnected,
    );

    if (gameAlreadyStarted && noPlayerInGame) {
      this.logger.log('--- No one is in the game. it should stop now ---');
      this.stopGame(gameId);
    }

    // Remove Bullet sound effects
    Array.from(game.bullets.values()).forEach((bullet) => {
      bullet.playSound = undefined;
      if (bullet.isCollided) removeBullet(game, bullet);
    });
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

    const gameAlreadyStarted =
      new Date().getTime() >= game.startingAt.getTime();

    if (!gameAlreadyStarted) {
      return { success: false };
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
    const tanks = Array.from(game.tanks.values()).filter(
      (t) => t.id !== tank.id,
    );

    const tankMovement = calculateTankMovement(tank, dto.input);
    const collidesObstacle = tankCollidesObstacle(
      tank,
      tankMovement,
      obstacles,
    );
    const aliveTanks = tanks.filter((t) => !t.isDead);
    const collidesTank = tankCollidesTank(tank, tankMovement, aliveTanks);
    const outOfMap = tankOutOfMap(tank, tankMovement, game.gameSettings.map);

    if (!collidesObstacle && !collidesTank && !outOfMap) {
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

  fireBullet(
    userId: string,
    gameId: string,
    dto: FireBulletDto,
  ): FireBulletResponseDto {
    const game = this.games.get(gameId);

    if (!game) {
      throw new WsException('Game not found');
    }

    const gameAlreadyStarted =
      new Date().getTime() >= game.startingAt.getTime();

    if (!gameAlreadyStarted) {
      return { success: false };
    }

    const player = game.players.get(userId);

    if (!player) {
      throw new WsException('Player not found');
    }

    const tank = game.tanks.get(player.tankId);

    if (!tank) {
      throw new WsException('Tank not found');
    }

    if (tank.bulletIds.length >= tank.maxBullets) {
      console.log('bullets', tank.bulletIds);
      this.logger.log(`Tank ${tank.id} is out of shooting limit`);
      return { success: false };
    }

    const position = calculateBulletStartingPosition(dto, tank);
    const bulletVariant = findBulletVariant(tank.bulletVariantId);

    if (!bulletVariant) {
      this.logger.error(`BulletVariant ${tank.bulletVariantId} does not exist`);
      throw new WsException('BulletVariant not found');
    }

    const bullet: Bullet = {
      ...bulletVariant,
      id: uuidv4(),
      variantId: bulletVariant.id,
      tankId: tank.id,
      position,
      direction: dto.direction,
      bounceCount: 0,
      rotation: dto.rotation,
      playSound: 'fire-bullet',
      isCollided: false,
    };

    game.bullets.set(bullet.id, bullet);
    tank.bulletIds.push(bullet.id);

    this.logger.log(`Tank ${tank.id} has fired a bullet ${bullet.id}`);

    return { success: true };
  }

  leaveGame(gameId: string, userId: string): LeaveGameResponseDto {
    const game = this.games.get(gameId);

    if (!game) {
      throw new WsException('Game not found');
    }

    const player = game.players.get(userId);

    if (!player) {
      throw new WsException('Player not found');
    }

    player.isConnected = false;
    player.isRejoining = true;

    this.logger.log(`User ${userId} left the game`);

    return { success: true };
  }

  async getMyRunningGame(
    userId: string,
  ): Promise<LobbyPreviewResponseDto | null> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const game = Array.from(this.games.values()).find((g) => {
      const player = g.players.get(userId);
      return !!player && player.isConnected;
    });

    if (!game) {
      return null;
    }

    return LobbyPreviewResponseDto.mapFromGameEntity(game);
  }

  handleDisconnect(
    gameId: string,
    userId: string,
  ): { playerLeftGame: boolean } {
    const game = this.games.get(gameId);
    let playerLeftGame = false;

    if (!game) {
      throw new WsException('Game not found');
    }

    const player = game.players.get(userId);

    if (!player) {
      throw new WsException('Player not found');
    }

    // If a team has already won, the user has finally disconnected and will not join again
    if (game.winningTeamId) {
      player.isConnected = false;
      playerLeftGame = true;
    } else {
      player.isRejoining = true;
    }

    return { playerLeftGame };
  }
}

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GameService } from '../game.service';
import { UserRepository } from '../../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../../user/user.entity';
import { extractTokenFromHandshake } from '../../../common/utils/ws.utils';
import { WsCurrentUserId } from '../../../common/decorators/ws-current-user.decorator';
import { JoinGameDto } from './dto/join-game.dto';
import { InitialGameStateResponseDto } from './dto/game-state-response.dto';
import { WsJwtGuard } from '../../../common/guards/ws-jwt-auth.guard';
import { UpdateTankPositionDto } from './dto/update-tank-position.dto';
import {
  UpdateTankPositionResponseDto,
  UpdateTurretRotationResponseDto,
} from './dto/update-tank-response.dto';
import { UpdateTurretRotationDto } from './dto/update-turret-rotation.dto';

@WebSocketGateway({
  cors: true,
  namespace: '/game',
})
@UseGuards(WsJwtGuard)
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.gameService.setServer(server);
  }

  private readonly logger = new Logger(GameGateway.name);
  private playerGameMap: Map<string, string> = new Map();

  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,

    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = extractTokenFromHandshake(client);

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.userId;

      client.data.userId = userId;

      this.logger.log(`User ${userId} connected with socket ${client.id}`);
    } catch (err) {
      this.logger.error('Connection error:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`User ${userId} disconnected`);
    // start timeout for user to reconnect
    // if user does not reconnect in the next 10 seconds, the user is kicked
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() dto: JoinGameDto,
    @ConnectedSocket() client: Socket,
    @WsCurrentUserId() userId: string,
  ): Promise<InitialGameStateResponseDto> {
    try {
      const game: InitialGameStateResponseDto = await this.gameService.joinGame(
        userId,
        dto,
      );

      await client.join(game.id);
      this.playerGameMap.set(userId, game.id);

      this.logger.log(`User ${userId} joined the game ${game.id}`);

      return game;
    } catch (error) {
      this.logger.log(`User ${userId} disconnected`);
      client.disconnect();
      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException('Internal server error');
    }
  }

  @SubscribeMessage('updateTankPosition')
  handleUpdateTankPosition(
    @MessageBody() dto: UpdateTankPositionDto,
    @WsCurrentUserId() userId: string,
  ): UpdateTankPositionResponseDto {
    try {
      const gameId = this.playerGameMap.get(userId);

      if (!gameId) {
        throw new WsException('Player is not part of any game');
      }

      return this.gameService.updateTankPosition(userId, gameId, dto);
    } catch (error) {
      this.logger.log(`User ${userId} disconnected`);
      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException('Internal server error');
    }
  }

  @SubscribeMessage('updateTurretRotation')
  handleUpdateTurretRotation(
    @MessageBody() dto: UpdateTurretRotationDto,
    @WsCurrentUserId() userId: string,
  ): UpdateTurretRotationResponseDto {
    try {
      const gameId = this.playerGameMap.get(userId);

      if (!gameId) {
        throw new WsException('Player is not part of any game');
      }

      return this.gameService.updateTurretRotation(userId, gameId, dto);
    } catch (error) {
      console.error('Error in handleUpdateTurretRotation:', error);
      this.logger.log(`User ${userId} disconnected`);
      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException('Internal server error');
    }
  }
}

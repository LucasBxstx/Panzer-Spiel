import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import { JoinGameDto } from './dto/game.dto';
import { GameStateResponseDto } from './dto/game-response.dto';
import { WsJwtGuard } from '../../../common/guards/ws-jwt-auth.guard';

@WebSocketGateway({
  cors: true,
  namespace: '/game',
})
@UseGuards(WsJwtGuard)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

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
  ): Promise<GameStateResponseDto> {
    try {
      const game: GameStateResponseDto = await this.gameService.joinGame(
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
      throw new WsException('Cannot join game');
    }
  }
}

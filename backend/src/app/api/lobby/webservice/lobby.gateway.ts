import { Inject, Logger, UseGuards } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { LobbyService } from '../lobby.service';
import { WsJwtGuard } from '../../../common/guards/ws-jwt-auth.guard';
import { CreateLobbyDto, JoinLobbyDto } from './dto/lobby.dto';
import { WsCurrentUserId } from '../../../common/decorators/ws-current-user.decorator';
import { UserRepository } from '../../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../../user/user.entity';
import {
  CreateGameResponseDto,
  LobbyResponseDto,
} from './dto/lobby-response.dto';
import { JwtService } from '@nestjs/jwt';
import { GameService } from '../../game/game.service';
import { extractTokenFromHandshake } from '../../../common/utils/ws.utils';
import { LobbyPlayer } from '../../../common/models/player.model';
import { Lobby } from '../../../common/models/lobby.model';
import { PlayerPreviewResponseDto } from '../../../common/dtos/player-preview-response.dto';

@WebSocketGateway({
  cors: true,
  namespace: '/lobby',
})
@UseGuards(WsJwtGuard)
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private playerLobbyMap: Map<string, string> = new Map();
  private readonly logger = new Logger(LobbyGateway.name);

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,

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

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`User ${userId} disconnected`);
    await this.handleLeaveLobby(client, userId);
  }

  @SubscribeMessage('createLobby')
  async handleCreateLobby(
    @MessageBody() dto: CreateLobbyDto,
    @ConnectedSocket() client: Socket,
    @WsCurrentUserId() userId: string,
  ): Promise<LobbyResponseDto> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new WsException('Unauthorized');
    }

    const player: LobbyPlayer = {
      userId,
      socketId: client.id,
      name: user.name,
      isConnected: true,
    };

    const lobby = await this.lobbyService.createLobby(userId, dto, player);
    await client.join(lobby.id);
    this.playerLobbyMap.set(userId, lobby.id);
    this.logger.log(
      `User ${userId} created and joined a new Lobby:  ${lobby.id}`,
    );

    return lobby;
  }

  @SubscribeMessage('joinLobby')
  async handleJoinLobby(
    @MessageBody() dto: JoinLobbyDto,
    @ConnectedSocket() client: Socket,
    @WsCurrentUserId() userId: string,
  ): Promise<LobbyResponseDto> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new WsException('Unauthorized');
    }

    const player: LobbyPlayer = {
      userId,
      socketId: client.id,
      name: user.name,
      isConnected: true,
    };

    try {
      const lobby = await this.lobbyService.joinLobby(
        userId,
        dto.lobbyId,
        player,
      );

      await client.join(dto.lobbyId);
      this.playerLobbyMap.set(userId, dto.lobbyId);

      this.server
        .to(dto.lobbyId)
        .emit('lobbyUpdated', LobbyResponseDto.mapFromEntity(lobby));
      this.server
        .to(dto.lobbyId)
        .emit('playerJoined', PlayerPreviewResponseDto.mapFromEntity(player));

      this.logger.log(`User ${userId} joined lobby ${lobby.id}`);

      if (lobby.players.length === lobby.gameSettings.maxPlayersCount) {
        const gameId = this.gameService.createGame(lobby);
        this.logger.log(
          `The lobby is complete, a new Game was created:  ${gameId}`,
        );

        this.startGameCountdown(lobby, { gameId });
      }

      return LobbyResponseDto.mapFromEntity(lobby);
    } catch (error) {
      this.logger.log(`User ${userId} disconnected`);
      client.disconnect();
      throw new WsException('Cannot join');
    }
  }

  @SubscribeMessage('leaveLobby')
  async handleLeaveLobby(
    @ConnectedSocket() client: Socket,
    @WsCurrentUserId() userId: string,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOne({ id: userId });
    const lobbyId = this.playerLobbyMap.get(userId);

    if (!user || !lobbyId) {
      return { success: false };
    }

    const lobby = await this.lobbyService.leaveLobby(userId, lobbyId);
    await client.leave(lobbyId);
    this.playerLobbyMap.delete(userId);

    if (lobby) {
      this.server.to(lobbyId).emit('lobbyUpdated', lobby);
      this.server.to(lobbyId).emit('playerLeft', client.data.userId);
      this.logger.log(`User ${userId} left the lobby ${lobby.id}`);
    }

    return { success: true };
  }

  private startGameCountdown(
    lobby: Lobby,
    createGameResponse: CreateGameResponseDto,
  ) {
    setTimeout(() => {
      this.server.in(lobby.id).emit('startGame', createGameResponse);
      this.logger.log(`startGame event emitted to lobby ${lobby.id}`);

      setTimeout(() => {
        this.server
          .in(lobby.id)
          .fetchSockets()
          .then((clients) => {
            lobby.players.forEach((player) => (player.isConnected = false));
            clients.forEach((client) => client.disconnect(true));
            this.logger.log(
              `All players in lobby ${lobby.id} have been disconnected`,
            );
          })
          .catch((err) => {
            this.logger.error('Error disconnecting players:', err);
          });
      }, 10000);
    }, 2000);
  }
}

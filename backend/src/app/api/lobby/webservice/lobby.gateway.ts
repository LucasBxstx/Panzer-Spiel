import {
  Inject,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from '../lobby.service';
import { WsJwtGuard } from '../../../common/guards/ws-jwt-auth.guard';
import { CreateLobbyDto, JoinLobbyDto } from './dto/lobby.dto';
import { WsCurrentUserId } from '../../../common/decorators/ws-current-user.decorator';
import { Player } from '../../../common/interfaces/game.interfaces';
import { UserRepository } from '../../user/user.repository';
import { EntityRepository } from '@mikro-orm/core';
import { User } from '../../user/user.entity';
import { LobbyResponseDto } from './dto/lobby-response.dto';

@WebSocketGateway({
  cors: true,
  namespace: '/lobby',
})
@UseGuards(WsJwtGuard)
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private playerLobbyMap: Map<string, string> = new Map();

  constructor(
    private lobbyService: LobbyService,

    @Inject(UserRepository)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  handleConnection(client: Socket) {
    try {
      const userId = client.data.userId;
      console.log(`User ${userId} connected with socket ${client.id}`);
    } catch (err) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    console.log(`User ${userId} disconnected`);
    await this.handleLeaveLobby(client);
  }

  @SubscribeMessage('createLobby')
  async handleCreateLobby(
    @MessageBody() dto: CreateLobbyDto,
    @ConnectedSocket() client: Socket,
    @WsCurrentUserId() userId: string,
  ) {
    const lobby = await this.lobbyService.createLobby(userId, dto);
    await client.join(lobby.id);
    this.playerLobbyMap.set(client.id, lobby.id);

    return { event: 'lobbyCreated', data: lobby };
  }

  @SubscribeMessage('joinLobby')
  async handleJoinLobby(
    @MessageBody() dto: JoinLobbyDto,
    @ConnectedSocket() client: Socket,
    @WsCurrentUserId() userId: string,
  ): Promise<{ event: string; data: LobbyResponseDto }> {
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    const player: Player = {
      userId,
      socketId: client.id,
      name: user.name,
    };

    const lobby = await this.lobbyService.joinLobby(
      userId,
      dto.lobbyId,
      player,
    );

    await client.join(dto.lobbyId);
    this.playerLobbyMap.set(client.id, dto.lobbyId);

    this.server.to(dto.lobbyId).emit('lobbyUpdated', lobby);
    this.server.to(dto.lobbyId).emit('playerJoined', player);

    return {
      event: 'joinedLobby',
      data: lobby,
    };
  }

  @SubscribeMessage('leaveLobby')
  async handleLeaveLobby(@ConnectedSocket() client: Socket) {
    const lobbyId = this.playerLobbyMap.get(client.id);

    if (!lobbyId) {
      throw new NotFoundException('Lobby not found');
    }

    const lobby = await this.lobbyService.leaveLobby(client.id, lobbyId);
    await client.leave(lobbyId);
    this.playerLobbyMap.delete(client.id);

    if (lobby) {
      this.server.to(lobbyId).emit('lobbyUpdated', lobby);
      this.server.to(lobbyId).emit('playerLeft', client.data.userId);
    }
  }
}

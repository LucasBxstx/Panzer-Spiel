import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        throw new WsException('Unauthorized');
      }

      const payload = await this.jwtService.verifyAsync(token);

      client.data.userId = payload.userId;

      return true;
    } catch (err) {
      throw new WsException('Unauthorized' + err);
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const token = client.handshake?.auth?.token;

    if (token) return token;

    // Alternative: Token aus Headers
    const authHeader = client.handshake?.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return client.handshake?.query?.token as string;
  }
}

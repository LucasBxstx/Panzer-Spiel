import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsCurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const client: Socket = ctx.switchToWs().getClient();
    return client.data.userId;
  },
);

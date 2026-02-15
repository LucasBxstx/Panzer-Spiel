import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsCurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const client: Socket = ctx.switchToWs().getClient();
    console.log('extracted userid', client.data.userId);
    return client.data.userId;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    return request.user.id;
  },
);

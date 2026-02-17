import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../models/request-with-user.model';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    return request.user.id;
  },
);

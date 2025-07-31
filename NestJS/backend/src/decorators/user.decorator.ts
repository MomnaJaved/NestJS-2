import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../interfaces/user-payload.interface';

export const User = createParamDecorator(
  <K extends keyof UserPayload>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): UserPayload[K] | UserPayload | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserPayload | undefined;
    if (!user) return null;

    if (data) {
      return user[data];
    }
    return user;
  },
);

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest() as Request;
    const now = new Date();

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.lockedUntilAt && user.lockedUntilAt > now) {
      throw new UnauthorizedException(
        user.lockedReason
          ? `Your account was locked until ${user.lockedUntilAt} due to "${user.lockedReason}"`
          : `Your account was locked until ${user.lockedUntilAt}`
      );
    }

    return true;
  }
}

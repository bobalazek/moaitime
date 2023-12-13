import { UserRoleEnum } from '@moaitime/shared-common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    return !!request.user && request.user.roles.includes(UserRoleEnum.ADMIN);
  }
}

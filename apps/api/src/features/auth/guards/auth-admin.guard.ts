import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UserRoleEnum } from '@myzenbuddy/shared-common';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    return !!request.user && request.user.roles.includes(UserRoleEnum.ADMIN);
  }
}

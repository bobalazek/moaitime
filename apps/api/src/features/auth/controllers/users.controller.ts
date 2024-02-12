import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { usersManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { PublicUserDto } from '../dtos/public-user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/users')
export class UsersController {
  @UseGuards(AuthenticatedGuard)
  @Get(':userUsername')
  async view(
    @Req() req: Request,
    @Param('userUsername') userUsername: string
  ): Promise<AbstractResponseDto<PublicUserDto>> {
    const data = await usersManager.view(req.user.id, userUsername);

    return {
      success: true,
      data,
    };
  }
}

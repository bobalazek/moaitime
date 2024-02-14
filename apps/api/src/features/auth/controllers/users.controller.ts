import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { usersManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { PublicUserDto } from '../dtos/public-user.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/users')
export class UsersController {
  @UseGuards(AuthenticatedGuard)
  @Get(':userIdOrUsername')
  async view(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto<PublicUserDto>> {
    const data = await usersManager.view(req.user.id, userIdOrUsername);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userIdOrUsername/follow')
  async follow(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    await usersManager.follow(req.user.id, userIdOrUsername);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userIdOrUsername/unfollow')
  async unfollow(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    await usersManager.unfollow(req.user.id, userIdOrUsername);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userIdOrUsername/block')
  async block(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    await usersManager.block(req.user.id, userIdOrUsername);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userIdOrUsername/unblock')
  async unblock(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    await usersManager.unblock(req.user.id, userIdOrUsername);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userIdOrUsername/last-active')
  async lastActive(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto<{ lastActiveAt: string | null }>> {
    const data = await usersManager.lastActive(req.user.id, userIdOrUsername);

    return {
      success: true,
      data: {
        lastActiveAt: data?.lastActiveAt?.toISOString() ?? null,
      },
    };
  }
}

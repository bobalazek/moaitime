import { Body, Controller, Get, Param, Post, Req, StreamableFile, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { usersManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { CreateUserReportDto } from '../../auth/dtos/create-user-report.dto';
import { PublicUserDto } from '../../auth/dtos/public-user.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/users')
export class UsersController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async search(@Req() req: Request): Promise<AbstractResponseDto> {
    const limit = 10;
    const previousCursor = req.query.previousCursor as string | undefined;
    const nextCursor = req.query.nextCursor as string | undefined;
    const query = req.query.query as string | undefined;

    const { data, meta } = await usersManager.search(req.user.id, {
      limit,
      previousCursor,
      nextCursor,
      query,
    });

    return {
      success: true,
      data,
      meta,
    };
  }

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
  @Get(':userIdOrUsername/avatar/:fileName')
  async avatar(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<StreamableFile> {
    const stream = await usersManager.avatar(req.user.id, userIdOrUsername);

    return new StreamableFile(stream);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userIdOrUsername/following')
  async following(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    const limit = 10;
    const previousCursor = req.query.previousCursor as string | undefined;
    const nextCursor = req.query.nextCursor as string | undefined;

    const { data, meta } = await usersManager.following(req.user.id, userIdOrUsername, {
      limit,
      previousCursor,
      nextCursor,
    });

    return {
      success: true,
      data,
      meta,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userIdOrUsername/followers')
  async followers(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    const limit = 10;
    const previousCursor = req.query.previousCursor as string | undefined;
    const nextCursor = req.query.nextCursor as string | undefined;

    const { data, meta } = await usersManager.followers(req.user.id, userIdOrUsername, {
      limit,
      previousCursor,
      nextCursor,
    });

    return {
      success: true,
      data,
      meta,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userIdOrUsername/follow-requests')
  async followRequests(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    const limit = 10;
    const previousCursor = req.query.previousCursor as string | undefined;
    const nextCursor = req.query.nextCursor as string | undefined;

    const { data, meta } = await usersManager.followRequests(req.user.id, userIdOrUsername, {
      limit,
      previousCursor,
      nextCursor,
    });

    return {
      success: true,
      data,
      meta,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':userIdOrUsername/achievements')
  async achievements(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    const data = await usersManager.achievements(req.user.id, userIdOrUsername);

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
  @Post(':userIdOrUsername/approve-follower')
  async approveFollower(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    await usersManager.approveFollower(req.user.id, userIdOrUsername);

    return {
      success: true,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userIdOrUsername/remove-follower')
  async removeFollower(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string
  ): Promise<AbstractResponseDto> {
    await usersManager.removeFollower(req.user.id, userIdOrUsername);

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
  @Post(':userIdOrUsername/report')
  async report(
    @Req() req: Request,
    @Param('userIdOrUsername') userIdOrUsername: string,
    @Body() body: CreateUserReportDto
  ): Promise<AbstractResponseDto> {
    await usersManager.report(req.user.id, userIdOrUsername, body);

    return {
      success: true,
    };
  }
}

import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { UserNotification } from '@moaitime/database-core';
import { userNotificationsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/user-notifications')
export class UserNotificationsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async index(@Req() req: Request): Promise<AbstractResponseDto<UserNotification[]>> {
    const limit = 10;
    const previousCursorParameter = req.query.previousCursor as string | undefined;
    const nextCursorParameter = req.query.nextCursor as string | undefined;

    const { data, meta } = await userNotificationsManager.list(req.user.id, {
      limit,
      previousCursor: previousCursorParameter,
      nextCursor: nextCursorParameter,
    });

    return {
      success: true,
      data,
      meta,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':userNotificationId')
  async delete(
    @Req() req: Request,
    @Param('userNotificationId') userNotificationId: string
  ): Promise<AbstractResponseDto<UserNotification>> {
    const data = await userNotificationsManager.delete(req.user.id, userNotificationId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('unread-count')
  async unreadCount(@Req() req: Request): Promise<AbstractResponseDto<number>> {
    const data = await userNotificationsManager.countUnreadByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('unseen-count')
  async unseenCount(@Req() req: Request): Promise<AbstractResponseDto<number>> {
    const data = await userNotificationsManager.countUnseenByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userNotificationId/mark-as-read')
  async markAsRead(
    @Req() req: Request,
    @Param('userNotificationId') userNotificationId: string
  ): Promise<AbstractResponseDto<UserNotification>> {
    const data = await userNotificationsManager.markAsRead(req.user.id, userNotificationId);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post(':userNotificationId/mark-as-unread')
  async markAsUnread(
    @Req() req: Request,
    @Param('userNotificationId') userNotificationId: string
  ): Promise<AbstractResponseDto<UserNotification>> {
    const data = await userNotificationsManager.markAsUnread(req.user.id, userNotificationId);

    return {
      success: true,
      data,
    };
  }
}

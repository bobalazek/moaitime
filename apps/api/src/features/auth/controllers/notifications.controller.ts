import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { UserNotification } from '@moaitime/database-core';
import { userNotificationsManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('/api/v1/notifications')
export class NotificationsController {
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
}

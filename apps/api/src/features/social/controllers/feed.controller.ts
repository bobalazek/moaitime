import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { feedManager } from '@moaitime/database-services';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/feed')
export class FeedController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto> {
    const limit = 10;
    const previousCursor = req.query.previousCursor as string | undefined;
    const nextCursor = req.query.nextCursor as string | undefined;

    const { data, meta } = await feedManager.list(req.user.id, undefined, {
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
}

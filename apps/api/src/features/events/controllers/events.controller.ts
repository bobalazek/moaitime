import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Event } from '@myzenbuddy/database-core';
import { eventsManager } from '@myzenbuddy/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/events')
export class EventsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Event[]>> {
    const data = await eventsManager.findManyByUserId(req.user.id);

    return {
      success: true,
      data,
    };
  }
}

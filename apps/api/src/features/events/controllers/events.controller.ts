import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Request } from 'express';

import { Event } from '@moaitime/database-core';
import { eventsManager } from '@moaitime/database-services';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/events')
export class EventsController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<Event[]>> {
    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';

    let from: Date | undefined = undefined;
    if (req.query.from) {
      const zonedFromDate = utcToZonedTime(req.query.from as string, timezone);
      from = zonedTimeToUtc(startOfDay(zonedFromDate), timezone);
    }

    let to: Date | undefined = undefined;
    if (req.query.to) {
      const zonedToDate = utcToZonedTime(req.query.to as string, timezone);
      to = zonedTimeToUtc(endOfDay(zonedToDate), timezone);
    }

    const data = await eventsManager.findManyByUserId(req.user.id, from, to);

    return {
      success: true,
      data,
    };
  }
}

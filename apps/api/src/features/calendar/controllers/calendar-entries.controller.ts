import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { eventsManager } from '@moaitime/database-services';
import {
  CalendarEntry,
  CalendarEntryTypeEnum,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
} from '@moaitime/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/calendar-entries')
export class CalendarEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntry[]>> {
    const nowString = new Date().toISOString();
    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';
    const from = getTimezonedStartOfDay(timezone, req.query.from) ?? undefined;
    const to = getTimezonedEndOfDay(timezone, req.query.to) ?? undefined;

    const events = await eventsManager.findManyByUserId(req.user.id, from, to);

    const data = events.map((event) => {
      return {
        ...event,
        id: `events:${event.id}`,
        type: CalendarEntryTypeEnum.EVENT,
        startsAt: event.startsAt?.toISOString().slice(0, -1) ?? nowString,
        endsAt: event.endsAt?.toISOString().slice(0, -1) ?? nowString,
        deletedAt: event.deletedAt?.toISOString() ?? null,
        createdAt: event.createdAt?.toISOString() ?? nowString,
        updatedAt: event.updatedAt?.toISOString() ?? nowString,
      };
    });

    return {
      success: true,
      data,
    };
  }
}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { zonedTimeToUtc } from 'date-fns-tz';
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
    const nowString = new Date().toISOString().slice(0, -1);
    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';
    const from = getTimezonedStartOfDay(timezone, req.query.from) ?? undefined;
    const to = getTimezonedEndOfDay(timezone, req.query.to) ?? undefined;

    const events = await eventsManager.findManyByUserId(req.user.id, from, to);

    const data = events.map((event) => {
      const startTimezone = event.timezone ?? 'UTC';
      const endTimezone = event.endTimezone ?? startTimezone;

      const startsAt = event.startsAt?.toISOString().slice(0, -1) ?? nowString;
      const endsAt = event.endsAt?.toISOString().slice(0, -1) ?? nowString;

      const startsAtUtc = zonedTimeToUtc(startsAt, startTimezone).toISOString();
      const endsAtUtc = zonedTimeToUtc(endsAt, endTimezone).toISOString();

      return {
        ...event,
        id: `events:${event.id}`,
        type: CalendarEntryTypeEnum.EVENT,
        startsAt,
        startsAtUtc,
        endsAt,
        endsAtUtc,
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

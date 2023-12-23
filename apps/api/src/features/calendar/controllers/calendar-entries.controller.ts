import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Request } from 'express';

import { Event } from '@moaitime/database-core';
import { eventsManager } from '@moaitime/database-services';
import {
  CalendarEntry,
  CalendarEntryTypeEnum,
  CalendarEntryYearlyEntry,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
  isValidDate,
} from '@moaitime/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/calendar-entries')
export class CalendarEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntry[]>> {
    if (!isValidDate(req.query.from)) {
      throw new Error('Invalid from date');
    }

    if (!isValidDate(req.query.to)) {
      throw new Error('Invalid to date');
    }

    let calendarIds: string[] | undefined = undefined;
    if (req.query.calendarIds) {
      calendarIds = req.query.calendarIds.split(',');
    }

    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';
    const from = getTimezonedStartOfDay(timezone, req.query.from) ?? undefined;
    const to = getTimezonedEndOfDay(timezone, req.query.to) ?? undefined;

    const events = await eventsManager.findManyByUserId(req.user.id, from, to, calendarIds);

    const data = this._convertEventsToCalendarEntries(events);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('yearly')
  async yearly(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntryYearlyEntry[]>> {
    const year = parseInt(req.query.year);

    const data = await eventsManager.getCountsByYearByUserId(req.user.id, year);

    return {
      success: true,
      data,
    };
  }

  // Private
  private _convertEventsToCalendarEntries(events: Event[]): CalendarEntry[] {
    const nowString = new Date().toISOString().slice(0, -1);

    return events.map((event) => {
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
  }
}

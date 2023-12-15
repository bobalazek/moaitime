import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Request } from 'express';

import { eventsManager } from '@moaitime/database-services';
import { CalendarEntry, CalendarEntryTypeEnum } from '@moaitime/shared-common';

import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';
import { AbstractResponseDto } from '../../core/dtos/responses/abstract-response.dto';

@Controller('/api/v1/calendar-entries')
export class CalendarEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntry[]>> {
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

    const nowString = new Date().toISOString();
    const events = await eventsManager.findManyByUserId(req.user.id, from, to);

    const data = events.map((event) => {
      return {
        ...event,
        id: `events:${event.id}`,
        type: CalendarEntryTypeEnum.EVENT,
        startsAt: event.startsAt?.toISOString() ?? nowString,
        endsAt: event.endsAt?.toISOString() ?? nowString,
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

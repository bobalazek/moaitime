import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { addDays, format, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Request } from 'express';

import { User } from '@moaitime/database-core';
import {
  calendarsManager,
  eventsManager,
  listsManager,
  tasksManager,
} from '@moaitime/database-services';
import {
  CalendarEntry,
  CalendarEntryTypeEnum,
  CalendarEntryYearlyEntry,
  Event,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
  isValidDate,
  Task,
} from '@moaitime/shared-common';

import { AbstractResponseDto } from '../../../dtos/responses/abstract-response.dto';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller('/api/v1/calendar-entries')
export class CalendarEntriesController {
  @UseGuards(AuthenticatedGuard)
  @Get()
  async list(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntry[]>> {
    if (!req.user) {
      throw new Error('User not found');
    }

    if (!isValidDate(req.query.from)) {
      throw new Error('Invalid from date');
    }

    if (!isValidDate(req.query.to)) {
      throw new Error('Invalid to date');
    }

    const timezone = req.user?.settings?.generalTimezone ?? 'UTC';
    const from = getTimezonedStartOfDay(timezone, req.query.from) ?? undefined;
    const to = getTimezonedEndOfDay(timezone, req.query.to) ?? undefined;

    const data = await this._getCalendarEntriesForDateRange(req.user, from, to);

    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('yearly')
  async yearly(@Req() req: Request): Promise<AbstractResponseDto<CalendarEntryYearlyEntry[]>> {
    const year = parseInt(req.query.year);

    // Calendar
    const calendarIds = await calendarsManager.getVisibleCalendarIdsByUserId(req.user.id);
    const calendarCounts = await eventsManager.getCountsByCalendarIdsAndYear(calendarIds, year);

    // Tasks
    const listIds = await listsManager.getVisibleListIdsByUserId(req.user.id);
    const taskCounts = await tasksManager.getCountsByListIdsAndYear(listIds, year);

    // Merge
    const daysMap = new Map<string, number>();
    for (const calendarCount of calendarCounts) {
      daysMap.set(calendarCount.date, calendarCount.count);
    }

    for (const taskCount of taskCounts) {
      const count = daysMap.get(taskCount.date) ?? 0;
      daysMap.set(taskCount.date, count + taskCount.count);
    }

    const data = [...daysMap.entries()].map(([date, count]) => ({
      date,
      count,
    })) as CalendarEntryYearlyEntry[];

    return {
      success: true,
      data,
    };
  }

  // Private
  private async _getCalendarEntriesForDateRange(
    user: User,
    from?: Date,
    to?: Date
  ): Promise<CalendarEntry[]> {
    const nowString = new Date().toISOString().slice(0, -1);
    const timezone = user.settings?.generalTimezone ?? 'UTC';

    const calendarIds = await calendarsManager.getVisibleCalendarIdsByUserId(user.id);
    const events = await eventsManager.findManyByCalendarIdsAndRange(calendarIds, from, to);
    const calendarEntries: CalendarEntry[] = events.map((event) => {
      const timezone = event.timezone ?? 'UTC';
      const endTimezone = event.endTimezone ?? timezone;

      // The startsAt and endsAt fields are retrived as Date objects from drizzle-orm,
      // but they are actually timezoned strings, so we need to remove the last "Z" character,
      // as that is not really that is actually what is stored in the database.
      const startsAt = event.startsAt?.toISOString().slice(0, -1) ?? nowString;
      const endsAt = event.endsAt?.toISOString().slice(0, -1) ?? nowString;

      const startsAtUtc = zonedTimeToUtc(startsAt, timezone).toISOString();
      const endsAtUtc = zonedTimeToUtc(endsAt, endTimezone).toISOString();

      const timesObject = {
        timezone,
        startsAt,
        startsAtUtc,
        endTimezone,
        endsAt,
        endsAtUtc,
      };

      return {
        id: `events:${event.id}`,
        type: CalendarEntryTypeEnum.EVENT,
        title: event.title,
        description: event.description,
        isAllDay: event.isAllDay,
        color: event.color ?? event.calendarColor ?? null,
        calendarId: event.calendarId,
        ...timesObject,
        raw: {
          ...event,
          timesObject,
        } as unknown as Event,
      };
    });

    const listIds = await listsManager.getVisibleListIdsByUserId(user.id);
    const tasks = await tasksManager.findManyByListIdsAndRange(listIds, from, to);
    for (const task of tasks) {
      // We should never have a task without a due date,
      // but we need to apease typescript.
      if (!task.dueDate) {
        continue;
      }

      let isAllDay = false;
      let dateString = task.dueDate;
      if (task.dueDateTime) {
        dateString = `${dateString}T${task.dueDateTime}:00.000`;
      } else {
        dateString = format(addDays(new Date(dateString), 1), 'yyyy-MM-dd');
        isAllDay = true;
      }

      if (task.dueDateTimeZone) {
        const timezonedDate = utcToZonedTime(
          zonedTimeToUtc(dateString, task.dueDateTimeZone),
          timezone
        );

        dateString = timezonedDate.toISOString().slice(0, -1);
      }

      const endsAt = dateString;
      const endsAtUtc = zonedTimeToUtc(endsAt, timezone).toISOString();

      const startsAt = subMinutes(new Date(dateString), 60).toISOString().slice(0, -1);
      const startsAtUtc = zonedTimeToUtc(startsAt, timezone).toISOString();

      calendarEntries.push({
        id: `tasks:${task.id}`,
        type: CalendarEntryTypeEnum.TASK,
        title: task.name,
        description: null,
        isAllDay,
        color: task.color ?? task.listColor ?? null,
        timezone,
        startsAt,
        startsAtUtc,
        endTimezone: timezone,
        endsAt,
        endsAtUtc,
        raw: task as unknown as Task,
      });
    }

    calendarEntries.sort((a, b) => {
      const aStartsAt = new Date(a.startsAtUtc);
      const bStartsAt = new Date(b.startsAtUtc);

      return aStartsAt.getTime() - bStartsAt.getTime();
    });

    return calendarEntries;
  }
}

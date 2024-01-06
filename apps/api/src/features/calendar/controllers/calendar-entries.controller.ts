import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { addDays, format, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Request } from 'express';

import { User } from '@moaitime/database-core';
import {
  CalendarsManager,
  calendarsManager,
  eventsManager,
  tasksManager,
} from '@moaitime/database-services';
import {
  CalendarEntry,
  CalendarEntryTypeEnum,
  CalendarEntryYearlyEntry,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
  isValidDate,
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

    const calendarIds = await calendarsManager.getVisibleCalendarIdsByUserId(req.user.id);
    const data = await eventsManager.getCountsByCalendarIdsAndYear(calendarIds, year);

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
    const userSettingsCalendarIds = await calendarsManager.getUserSettingsCalendarIds(user);
    const calendarIds = await calendarsManager.getVisibleCalendarIdsByUserId(user.id);
    const events = await eventsManager.findManyByCalendarIdsAndRange(calendarIds, from, to);

    const calendarEntries: CalendarEntry[] = events.map((event) => {
      const timezone = event.timezone ?? 'UTC';
      const endTimezone = event.endTimezone ?? timezone;

      const startsAt = event.startsAt?.toISOString().slice(0, -1) ?? nowString;
      const endsAt = event.endsAt?.toISOString().slice(0, -1) ?? nowString;

      const startsAtUtc = zonedTimeToUtc(startsAt, timezone).toISOString();
      const endsAtUtc = zonedTimeToUtc(endsAt, endTimezone).toISOString();

      return {
        ...event,
        id: `events:${event.id}`,
        type: CalendarEntryTypeEnum.EVENT,
        timezone,
        startsAt,
        startsAtUtc,
        endTimezone,
        endsAt,
        endsAtUtc,
        deletedAt: event.deletedAt?.toISOString() ?? null,
        createdAt: event.createdAt!.toISOString(),
        updatedAt: event.updatedAt!.toISOString(),
      };
    });

    if (userSettingsCalendarIds.includes(CalendarsManager.CUSTOM_CALENDAR_DUE_TASKS_KEY)) {
      const timezone = user.settings?.generalTimezone ?? 'UTC';

      const dueTasks = await tasksManager.findManyByUserIdWithDueDate(user.id, from, to);
      for (const task of dueTasks) {
        // We should never have a task without a due date,
        // but we need to apease typescript.
        if (!task.dueDate) {
          continue;
        }

        let dateString = task.dueDate;
        if (task.dueDateTime) {
          dateString = `${dateString}T${task.dueDateTime}:00.000`;
        } else {
          dateString = format(addDays(new Date(dateString), 1), 'yyyy-MM-dd');
        }

        if (task.dueDateTimeZone) {
          const timezonedDate = utcToZonedTime(
            zonedTimeToUtc(dateString, task.dueDateTimeZone),
            timezone
          );

          dateString = timezonedDate.toISOString();
        }

        const endsAt = dateString;
        const endsAtUtc = zonedTimeToUtc(endsAt, timezone).toISOString();

        const startsAt = subMinutes(new Date(endsAtUtc), 60).toISOString().slice(0, -1);
        const startsAtUtc = zonedTimeToUtc(startsAt, timezone).toISOString();

        calendarEntries.push({
          ...task,
          id: `tasks:${task.id}`,
          type: CalendarEntryTypeEnum.TASK,
          title: task.name,
          isAllDay: false,
          calendarId: null,
          timezone,
          startsAt,
          startsAtUtc,
          endTimezone: timezone,
          endsAt,
          endsAtUtc,
          deletedAt: task.deletedAt?.toISOString() ?? null,
          createdAt: task.createdAt!.toISOString(),
          updatedAt: task.updatedAt!.toISOString(),
        });
      }
    }

    calendarEntries.sort((a, b) => {
      const aStartsAt = new Date(a.startsAtUtc);
      const bStartsAt = new Date(b.startsAtUtc);

      return aStartsAt.getTime() - bStartsAt.getTime();
    });

    return calendarEntries;
  }
}

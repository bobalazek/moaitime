import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import {
  calendarEntriesManager,
  calendarsManager,
  eventsManager,
  listsManager,
  tasksManager,
} from '@moaitime/database-services';
import {
  CalendarEntry,
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

    const data = await calendarEntriesManager.findAllForRange(req.user, from, to);

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
}

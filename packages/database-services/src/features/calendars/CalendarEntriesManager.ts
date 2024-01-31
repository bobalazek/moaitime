import { addDays, format, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import { User } from '@moaitime/database-core';
import {
  CalendarEntry,
  CalendarEntryTypeEnum,
  CalendarEntryYearlyEntry,
  Event,
  getRuleIterationsBetween,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
  isValidDate,
  Task,
} from '@moaitime/shared-common';

import { listsManager } from '../tasks/ListsManager';
import { tasksManager } from '../tasks/TasksManager';
import { calendarsManager } from './CalendarsManager';
import { eventsManager, EventsManagerEvent } from './EventsManager';

export class CalendarEntriesManager {
  // Helpers
  async list(user: User, from: string, to: string) {
    if (!isValidDate(from)) {
      throw new Error('Invalid from date');
    }

    if (!isValidDate(to)) {
      throw new Error('Invalid to date');
    }

    const timezone = user?.settings?.generalTimezone ?? 'UTC';
    const timezonedFrom = getTimezonedStartOfDay(timezone, from) ?? undefined;
    const timezonedTo = getTimezonedEndOfDay(timezone, to) ?? undefined;

    return calendarEntriesManager.findAllForRange(user, timezonedFrom, timezonedTo);
  }

  async yearly(userId: string, year: number) {
    // Calendar
    const calendarIdsMap = await calendarsManager.getVisibleCalendarIdsByUserIdMap(userId);
    const calendarIds = Array.from(calendarIdsMap.keys());
    const calendarCounts = await eventsManager.getCountsByCalendarIdsAndYear(calendarIds, year);

    // Tasks
    const listIds = await listsManager.getVisibleListIdsByUserId(userId);
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

    return [...daysMap.entries()].map(([date, count]) => ({
      date,
      count,
    })) as CalendarEntryYearlyEntry[];
  }

  async findAllForRange(user: User, from?: Date, to?: Date): Promise<CalendarEntry[]> {
    const timezone = user.settings?.generalTimezone ?? 'UTC';

    const calendarIdsMap = await calendarsManager.getVisibleCalendarIdsByUserIdMap(user.id);
    const events = await eventsManager.findManyByCalendarIdsAndRange(
      calendarIdsMap,
      user.id,
      from,
      to
    );
    const calendarEntries: CalendarEntry[] = events.map((event) => {
      return this._convertEventToCalendarEntry(event);
    });

    // Repeating events
    if (from && to) {
      const recurringEvents = await eventsManager.findManyByCalendarIdsAndRange(
        calendarIdsMap,
        user.id,
        from,
        to,
        true
      );
      for (const event of recurringEvents) {
        // This will never happen, but we need typescript to be happy.
        if (!event.repeatPattern) {
          continue;
        }

        const eventIterations = getRuleIterationsBetween(event.repeatPattern, from, to);
        for (const eventIteration of eventIterations) {
          const calendarEntry = this._convertEventToCalendarEntry(event, eventIteration);

          // Since we are only dealing with recurring events more than da
          const calendarEntryIsOriginal =
            event.startsAt &&
            format(eventIteration, 'yyyy-MM-dd') === format(event.startsAt, 'yyyy-MM-dd');

          // We ignore the original event from which this all stems from,
          // as that is already added above.
          if (calendarEntryIsOriginal) {
            continue;
          }

          calendarEntries.push(calendarEntry);
        }
      }
    }

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

      const startDurationMinutesSub = task.durationSeconds ? task.durationSeconds / 60 : 30;

      const startsAt = subMinutes(new Date(dateString), startDurationMinutesSub)
        .toISOString()
        .slice(0, -1);
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

  // Private
  private _convertEventToCalendarEntry(
    event: EventsManagerEvent,
    eventIterationDate?: Date
  ): CalendarEntry {
    const nowString = new Date().toISOString().slice(0, -1);
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
    const eventTimesObject = {
      ...timesObject,
    };

    if (eventIterationDate) {
      const originalStartDate = new Date(event.startsAt ?? nowString);
      const originalEndDate = new Date(event.endsAt ?? nowString);
      const duration = originalEndDate.getTime() - originalStartDate.getTime();

      const iteratedStartDateTime = new Date(eventIterationDate);
      iteratedStartDateTime.setHours(
        originalStartDate.getHours(),
        originalStartDate.getMinutes(),
        originalStartDate.getSeconds()
      );

      const iteratedEndDateTime = new Date(iteratedStartDateTime.getTime() + duration);

      const iteratedStartsAt = iteratedStartDateTime.toISOString().slice(0, -1);
      const iteratedEndsAt = iteratedEndDateTime.toISOString().slice(0, -1);

      const iteratedStartsAtUtc = zonedTimeToUtc(iteratedStartsAt, timezone).toISOString();
      const iteratedEndsAtUtc = zonedTimeToUtc(iteratedEndsAt, endTimezone).toISOString();

      timesObject.startsAt = iteratedStartsAt;
      timesObject.startsAtUtc = iteratedStartsAtUtc;
      timesObject.endsAt = iteratedEndsAt;
      timesObject.endsAtUtc = iteratedEndsAtUtc;
    }

    const id = eventIterationDate
      ? `events:${event.id}:${eventIterationDate.getTime()}`
      : `events:${event.id}`;

    return {
      id,
      type: CalendarEntryTypeEnum.EVENT,
      title: event.title,
      description: event.description,
      isAllDay: event.isAllDay,
      color: event.color ?? event.calendarColor ?? null,
      permissions: event.permissions,
      ...timesObject,
      raw: {
        ...event,
        ...eventTimesObject,
      } as unknown as Event,
    };
  }
}

export const calendarEntriesManager = new CalendarEntriesManager();

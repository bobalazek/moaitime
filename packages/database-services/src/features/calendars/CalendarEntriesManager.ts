import { addDays, format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { User } from '@moaitime/database-core';
import { Recurrence } from '@moaitime/recurrence';
import {
  CalendarEntry,
  CalendarEntryTypeEnum,
  CalendarEntryYearlyEntry,
  Event,
  getStartAndEndDatesForTask,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
  isValidDate,
  Task,
} from '@moaitime/shared-common';

import { listsManager, ListsManager } from '../tasks/ListsManager';
import { tasksManager, TasksManager, TaskWithTagsAndUsers } from '../tasks/TasksManager';
import { calendarsManager, CalendarsManager } from './CalendarsManager';
import { eventsManager, EventsManager, EventsManagerEvent } from './EventsManager';

export class CalendarEntriesManager {
  constructor(
    private _calendarsManager: CalendarsManager,
    private _listsManager: ListsManager,
    private _tasksManager: TasksManager,
    private _eventsManager: EventsManager
  ) {}

  // API Helpers
  async list(actorUser: User, from: string, to: string) {
    if (!isValidDate(from)) {
      throw new Error('Invalid from date');
    }

    if (!isValidDate(to)) {
      throw new Error('Invalid to date');
    }

    return calendarEntriesManager.findAllForRange(actorUser, from, to);
  }

  async yearly(actorUserId: string, year: number) {
    // Calendar
    const calendarIdsMap =
      await this._calendarsManager.getVisibleCalendarIdsByUserIdMap(actorUserId);
    const calendarIds = Array.from(calendarIdsMap.keys());
    const calendarCounts = await this._eventsManager.getCountsByCalendarIdsAndYear(
      calendarIds,
      year
    );

    // Tasks
    const listIds = await this._listsManager.getVisibleListIdsByUserId(actorUserId);
    const taskCounts = await this._tasksManager.getCountsByListIdsAndYear(listIds, year);

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

  // Helpers
  async findAllForRange(user: User, from: string, to: string): Promise<CalendarEntry[]> {
    const timezone = user.settings?.generalTimezone ?? 'UTC';
    const tasksDefaultDurationSeconds = user.settings?.tasksDefaultDurationSeconds ?? 30;

    let timezonedFrom = getTimezonedStartOfDay(timezone, from) ?? undefined;
    let timezonedTo = getTimezonedEndOfDay(timezone, to) ?? undefined;

    // To be safe, we need to additionally pull a day before and end, so we catch all events in all timezones.
    // One day doesn't seem to be enough, as let's make it 2 for now.
    if (timezonedFrom) {
      timezonedFrom = addDays(timezonedFrom, -2);
    }
    if (timezonedTo) {
      timezonedTo = addDays(timezonedTo, 2);
    }

    const calendarIdsMap = await this._calendarsManager.getVisibleCalendarIdsByUserIdMap(user.id);
    const events = await this._eventsManager.findManyByCalendarIdsAndRange(
      calendarIdsMap,
      user.id,
      timezonedFrom,
      timezonedTo
    );
    const calendarEntries: CalendarEntry[] = events.map((event) => {
      return this._convertEventToCalendarEntry(event);
    });

    // Repeating events
    const recurrenceFrom = from ? new Date(`${from}T00:00:00.000`) : null;
    const recurrenceTo = to ? new Date(`${to}T23:59:59.999`) : null;

    if (recurrenceFrom && recurrenceTo) {
      const recurringEvents = await this._eventsManager.findManyByCalendarIdsAndRange(
        calendarIdsMap,
        user.id,
        timezonedFrom,
        timezonedTo,
        true
      );
      for (const event of recurringEvents) {
        // This will never happen, but we need typescript to be happy.
        if (!event.repeatPattern) {
          continue;
        }

        const recurrence = Recurrence.fromStringPattern(event.repeatPattern);
        const eventIterations = recurrence.getDatesBetween(recurrenceFrom, recurrenceTo);
        for (const eventIteration of eventIterations) {
          const calendarEntry = this._convertEventToCalendarEntry(event, eventIteration);

          // Since we are only dealing with recurring events more than day
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

    const listIds = await this._listsManager.getVisibleListIdsByUserId(user.id);
    const rawTasks = await this._tasksManager.findManyByListIdsAndRange(
      listIds,
      user.id,
      timezonedFrom,
      timezonedTo
    );
    const tasks = await this._tasksManager.populateTagsAndUsers(rawTasks);
    for (const task of tasks) {
      // We should never have a task without a due date,
      // but we need to apease typescript.
      if (!task.dueDate) {
        continue;
      }

      const calendarEntry = this._convertTaskToCalendarEntry(
        task,
        timezone,
        tasksDefaultDurationSeconds
      );
      calendarEntries.push(calendarEntry);

      if (task.dueDateRepeatPattern && recurrenceFrom && recurrenceTo) {
        const recurrence = Recurrence.fromStringPattern(task.dueDateRepeatPattern);
        const taskIterations = recurrence.getDatesBetween(recurrenceFrom, recurrenceTo);
        for (const taskIteration of taskIterations) {
          const calendarEntryIteration = this._convertTaskToCalendarEntry(
            task,
            timezone,
            tasksDefaultDurationSeconds,
            taskIteration
          );

          // Since we are only dealing with recurring events more than day
          const calendarEntryIsOriginal =
            calendarEntry.startsAtUtc === calendarEntryIteration.startsAtUtc;

          // We ignore the original event from which this all stems from,
          // as that is already added above.
          if (calendarEntryIsOriginal) {
            continue;
          }

          calendarEntries.push(calendarEntryIteration);
        }
      }
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

  private _convertTaskToCalendarEntry(
    task: TaskWithTagsAndUsers,
    generalTimezone: string,
    tasksDefaultDurationSeconds: number,
    taskIterationDate?: Date
  ): CalendarEntry {
    const nowString = new Date().toISOString().slice(0, -1);

    const timesObject = getStartAndEndDatesForTask(
      task as unknown as Task,
      generalTimezone,
      tasksDefaultDurationSeconds
    )!;
    const taskTimesObject = {
      ...timesObject,
    };

    if (taskIterationDate) {
      const originalStartDate = new Date(timesObject.startsAt ?? nowString);
      const originalEndDate = new Date(timesObject.endsAt ?? nowString);
      const duration = originalEndDate.getTime() - originalStartDate.getTime();

      const iteratedStartDateTime = new Date(taskIterationDate);
      iteratedStartDateTime.setHours(
        originalStartDate.getHours(),
        originalStartDate.getMinutes(),
        originalStartDate.getSeconds()
      );

      const iteratedEndDateTime = new Date(iteratedStartDateTime.getTime() + duration);

      const iteratedStartsAt = iteratedStartDateTime.toISOString().slice(0, -1);
      const iteratedEndsAt = iteratedEndDateTime.toISOString().slice(0, -1);

      const iteratedStartsAtUtc = zonedTimeToUtc(
        iteratedStartsAt,
        timesObject.timezone
      ).toISOString();
      const iteratedEndsAtUtc = zonedTimeToUtc(iteratedEndsAt, timesObject.timezone).toISOString();

      timesObject.startsAt = iteratedStartsAt;
      timesObject.startsAtUtc = iteratedStartsAtUtc;
      timesObject.endsAt = iteratedEndsAt;
      timesObject.endsAtUtc = iteratedEndsAtUtc;
    }

    const id = taskIterationDate
      ? `tasks:${task.id}:${taskIterationDate.getTime()}`
      : `tasks:${task.id}`;

    return {
      id,
      type: CalendarEntryTypeEnum.TASK,
      title: task.name,
      description: null,
      color: task.color ?? task.listColor ?? null,
      ...timesObject,
      raw: {
        ...task,
        ...taskTimesObject,
      } as unknown as Task,
    };
  }
}

export const calendarEntriesManager = new CalendarEntriesManager(
  calendarsManager,
  listsManager,
  tasksManager,
  eventsManager
);

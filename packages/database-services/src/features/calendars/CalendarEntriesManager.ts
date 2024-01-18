import { addDays, format, subMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import { User } from '@moaitime/database-core';
import { CalendarEntry, CalendarEntryTypeEnum, Event, Task } from '@moaitime/shared-common';

import { ListsManager, listsManager } from '../tasks/ListsManager';
import { TasksManager, tasksManager } from '../tasks/TasksManager';
import { CalendarsManager, calendarsManager } from './CalendarsManager';
import { EventsManager, eventsManager } from './EventsManager';

export class CalendarEntriesManager {
  constructor(
    private _calendarsManager: CalendarsManager,
    private _eventsManager: EventsManager,
    private _listsManager: ListsManager,
    private _tasksManager: TasksManager
  ) {}

  async findAllForRange(user: User, from?: Date, to?: Date): Promise<CalendarEntry[]> {
    const nowString = new Date().toISOString().slice(0, -1);
    const timezone = user.settings?.generalTimezone ?? 'UTC';

    const calendarIdsMap = await this._calendarsManager.getVisibleCalendarIdsByUserIdMap(user.id);
    const events = await this._eventsManager.findManyByCalendarIdsAndRange(
      calendarIdsMap,
      user.id,
      from,
      to
    );
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
          ...timesObject,
        } as unknown as Event,
      };
    });

    const listIds = await this._listsManager.getVisibleListIdsByUserId(user.id);
    const tasks = await this._tasksManager.findManyByListIdsAndRange(listIds, from, to);
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
}

export const calendarEntriesManager = new CalendarEntriesManager(
  calendarsManager,
  eventsManager,
  listsManager,
  tasksManager
);

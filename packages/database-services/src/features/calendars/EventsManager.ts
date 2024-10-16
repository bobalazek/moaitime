import { format } from 'date-fns';
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
  SQL,
} from 'drizzle-orm';

import {
  Calendar,
  calendars,
  Event,
  events,
  getDatabase,
  NewEvent,
  User,
  userCalendars,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { Recurrence } from '@moaitime/recurrence';
import {
  CreateEvent,
  getTimezonedEndOfDay,
  getTimezonedStartOfDay,
  GlobalEventsEnum,
  Permissions,
  UpdateEvent,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';
import { userUsageManager } from '../auth/UserUsageManager';
import { calendarsManager, CalendarsManagerVisibleCalendarsMap } from './CalendarsManager';

export type EventsManagerEvent = Event & {
  calendarColor: string | null;
  permissions?: Permissions;
};

export class EventsManager {
  // API Helpers
  async list(actorUser: User, from: string, to: string) {
    const timezone = actorUser.settings?.generalTimezone ?? 'UTC';
    const timezonedFrom = getTimezonedStartOfDay(timezone, from) ?? undefined;
    const timezonedTo = getTimezonedEndOfDay(timezone, to) ?? undefined;

    const calendarIdsMap = await calendarsManager.getVisibleCalendarIdsByUserIdMap(actorUser.id);
    return this.findManyByCalendarIdsAndRange(
      calendarIdsMap,
      actorUser.id,
      timezonedFrom,
      timezonedTo
    );
  }

  async create(actorUser: User, data: CreateEvent) {
    let calendar: Calendar | null = null;
    if (data.calendarId) {
      calendar = await calendarsManager.findOneByIdAndUserId(data.calendarId, actorUser.id);
      if (!calendar) {
        throw new Error('Calendar not found');
      }
    }

    await this._checkIfLimitReached(actorUser, data.calendarId);

    const timezone = data.timezone ?? actorUser?.settings?.generalTimezone ?? 'UTC';

    const event = await this.insertOne({
      ...data,
      timezone,
      userId: actorUser.id,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      repeatEndsAt: data.repeatEndsAt ? new Date(data.repeatEndsAt) : undefined,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_EVENT_ADDED, {
      actorUserId: actorUser.id,
      eventId: event.id,
      calendarId: event.calendarId ?? undefined,
      teamId: calendar?.teamId ?? undefined,
    });

    return event;
  }

  async update(actorUserId: string, eventId: string, data: UpdateEvent) {
    const canUpdate = await this.userCanUpdate(actorUserId, eventId);
    if (!canUpdate) {
      throw new Error('You cannot update this event');
    }

    const event = await this.findOneById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const now = new Date();
    const startsAt = data.startsAt ? new Date(data.startsAt) : undefined;
    const endsAt = data.endsAt ? new Date(data.endsAt) : undefined;
    const finalStartsAt = startsAt ?? event.startsAt ?? now;
    const finalEndsAt = endsAt ?? event.endsAt ?? now;
    if (finalStartsAt > finalEndsAt) {
      throw new Error('Start date must be before end date');
    }

    const durationSeconds = (finalEndsAt.getTime() - finalStartsAt.getTime()) / 1000;
    if (!event.isAllDay && durationSeconds < 60) {
      throw new Error('Event must be at least 1 minute long');
    }

    // We need to account for the null value, which means to unset the value,
    // where as undefined means to not update the value.
    const repeatEndsAt = data.repeatEndsAt
      ? new Date(data.repeatEndsAt)
      : data.repeatEndsAt === null
        ? null
        : undefined;

    const repeatPattern = data.repeatPattern ?? event.repeatPattern;
    if (startsAt && repeatPattern && data.repeatPattern !== null) {
      const recurrence = Recurrence.fromStringPattern(repeatPattern);
      recurrence.updateOptions({
        startsAt,
      });

      data.repeatPattern = recurrence.toStringPattern();
    }

    const newEvent = await this.updateOneById(eventId, {
      ...data,
      startsAt,
      endsAt,
      repeatEndsAt,
    });
    const calendar = await calendarsManager.findOneByIdAndUserId(newEvent.calendarId, actorUserId);

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_EVENT_EDITED, {
      actorUserId,
      eventId: newEvent.id,
      calendarId: newEvent.calendarId ?? undefined,
      teamId: calendar?.teamId ?? undefined,
    });

    return newEvent;
  }

  async delete(actorUserId: string, eventId: string) {
    const canDelete = await this.userCanDelete(actorUserId, eventId);
    if (!canDelete) {
      throw new Error('Event not found');
    }

    const event = await this.updateOneById(eventId, {
      deletedAt: new Date(),
    });
    const calendar = await calendarsManager.findOneByIdAndUserId(event.calendarId, actorUserId);

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_EVENT_DELETED, {
      actorUserId,
      eventId: event.id,
      calendarId: event.calendarId ?? undefined,
      teamId: calendar?.teamId ?? undefined,
    });

    return event;
  }

  async undelete(actorUser: User, eventId: string) {
    const canDelete = await this.userCanUpdate(actorUser.id, eventId);
    if (!canDelete) {
      throw new Error('You cannot undelete this event');
    }

    const event = await this.findOneById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    await this._checkIfLimitReached(actorUser, event.calendarId);

    const undeletedEvent = await this.updateOneById(eventId, {
      deletedAt: null,
    });
    const calendar = await calendarsManager.findOneByIdAndUserId(
      undeletedEvent.calendarId,
      actorUser.id
    );

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_EVENT_UNDELETED, {
      actorUserId: actorUser.id,
      eventId: undeletedEvent.id,
      calendarId: undeletedEvent.calendarId ?? undefined,
      teamId: calendar?.teamId ?? undefined,
    });

    return undeletedEvent;
  }

  // Permissions
  async userCanView(userId: string, eventId: string): Promise<boolean> {
    const event = await this.findOneById(eventId);
    if (!event) {
      return false;
    }

    return calendarsManager.userCanView(userId, event.calendarId);
  }

  async userCanUpdate(userId: string, eventId: string): Promise<boolean> {
    const event = await this.findOneById(eventId);
    if (!event) {
      return false;
    }

    const calendar = await calendarsManager.findOneByIdAndUserId(event.calendarId, userId);
    if (!calendar) {
      return false;
    }

    if (calendar.isPublic) {
      return false;
    }

    if (calendar.teamId) {
      const teamIds = await usersManager.getTeamIds(userId);
      return teamIds.includes(calendar.teamId);
    }

    return calendarsManager.userCanUpdate(userId, event.calendarId);
  }

  async userCanDelete(userId: string, eventId: string): Promise<boolean> {
    const event = await this.findOneById(eventId);
    if (!event) {
      return false;
    }

    const calendar = await calendarsManager.findOneByIdAndUserId(event.calendarId, userId);
    if (!calendar) {
      return false;
    }

    if (calendar.isPublic) {
      return false;
    }

    if (calendar.teamId) {
      const teamIds = await usersManager.getTeamIds(userId);
      return teamIds.includes(calendar.teamId);
    }

    return calendarsManager.userCanDelete(userId, event.calendarId);
  }

  // Helpers
  async findManyByCalendarId(calendarId: string): Promise<Event[]> {
    return getDatabase().query.events.findMany({
      where: and(eq(events.calendarId, calendarId), isNull(events.deletedAt)),
    });
  }

  async findManyByCalendarIdsAndRange(
    calendarIdsMap: CalendarsManagerVisibleCalendarsMap,
    userId: string,
    from?: Date,
    to?: Date,
    onlyRecurring?: boolean
  ): Promise<EventsManagerEvent[]> {
    const calendarIds = Array.from(calendarIdsMap.keys());
    if (calendarIds.length === 0) {
      return [];
    }

    let where = and(
      inArray(calendars.id, calendarIds),
      isNull(calendars.deletedAt),
      isNull(events.deletedAt)
    );

    if (onlyRecurring) {
      where = and(where, isNotNull(events.repeatPattern)) as SQL<unknown>;

      if (from && to) {
        where = and(
          where,
          or(
            and(
              isNull(events.startsAt),
              or(isNull(events.repeatEndsAt), gte(events.repeatEndsAt, from))
            ),
            and(isNull(events.repeatEndsAt), or(isNull(events.startsAt), lt(events.startsAt, to))),
            and(gte(events.startsAt, from), lte(events.startsAt, to)),
            and(gte(events.repeatEndsAt, from), lte(events.repeatEndsAt, to)),
            and(lt(events.startsAt, from), gt(events.repeatEndsAt, to)),
            and(
              lt(events.startsAt, from),
              or(isNull(events.repeatEndsAt), gt(events.repeatEndsAt, to))
            )
          )
        ) as SQL<unknown>;
      } else if (from) {
        where = and(
          where,
          or(
            isNull(events.startsAt),
            gte(events.startsAt, from),
            and(
              lt(events.startsAt, from),
              or(isNull(events.repeatEndsAt), gt(events.repeatEndsAt, from))
            )
          )
        ) as SQL<unknown>;
      } else if (to) {
        where = and(
          where,
          or(
            isNull(events.repeatEndsAt),
            lte(events.repeatEndsAt, to),
            and(isNull(events.startsAt), lte(events.startsAt, to))
          )
        ) as SQL<unknown>;
      }
    } else {
      if (from && to) {
        where = and(
          where,
          or(
            and(gte(events.startsAt, from), lte(events.startsAt, to)),
            and(gte(events.endsAt, from), lte(events.endsAt, to)),
            and(lt(events.startsAt, from), gt(events.endsAt, to))
          )
        ) as SQL<unknown>;
      } else if (from) {
        where = and(where, gte(events.startsAt, from)) as SQL<unknown>;
      } else if (to) {
        where = and(where, lte(events.endsAt, to)) as SQL<unknown>;
      }
    }

    const result = await getDatabase()
      .select()
      .from(events)
      .leftJoin(calendars, eq(events.calendarId, calendars.id))
      .where(where)
      .orderBy(asc(events.startsAt), asc(events.endsAt), desc(events.updatedAt))
      .execute();

    // User calendars map
    const userCalendarCalendarIds: string[] = [];
    for (const [calendarId, type] of calendarIdsMap.entries()) {
      if (type !== 'user-shared') {
        continue;
      }

      userCalendarCalendarIds.push(calendarId);
    }

    const userCalendarRows =
      userCalendarCalendarIds.length > 0
        ? await getDatabase()
            .select()
            .from(userCalendars)
            .where(
              and(
                inArray(userCalendars.calendarId, userCalendarCalendarIds),
                eq(userCalendars.userId, userId)
              )
            )
            .execute()
        : [];

    const userCalendarColorMap = new Map<string, string | null>();
    for (const row of userCalendarRows) {
      userCalendarColorMap.set(row.calendarId, row.color);
    }

    const finalRows: (Event & { calendarColor: string | null; permissions?: Permissions })[] = [];

    for (const row of result) {
      const calendarPermissions = await calendarsManager.getPermissions(userId, row.calendars!);

      let permissions: Permissions | undefined = undefined;
      if (calendarPermissions) {
        // TODO: optimise as this is quite DB heavy
        let canUpdate = calendarPermissions.canUpdate;
        if (!canUpdate) {
          canUpdate = await this.userCanUpdate(userId, row.events.id);
        }

        let canDelete = calendarPermissions.canDelete;
        if (!canDelete) {
          canDelete = await this.userCanDelete(userId, row.events.id);
        }

        permissions = {
          canView: true,
          canUpdate,
          canDelete,
        };
      }

      const userCalendarColor = userCalendarColorMap.get(row.calendars!.id);

      finalRows.push({
        ...row.events,
        calendarColor: userCalendarColor ?? row.calendars?.color ?? null,
        permissions,
      });
    }

    return finalRows;
  }

  async findOneById(eventId: string): Promise<Event | null> {
    const row = await getDatabase().query.events.findFirst({
      where: eq(events.id, eventId),
    });

    return row ?? null;
  }

  async insertOne(data: NewEvent): Promise<Event> {
    const rows = await getDatabase().insert(events).values(data).returning();

    return rows[0];
  }

  async updateOneById(eventId: string, data: Partial<NewEvent>): Promise<Event> {
    const rows = await getDatabase()
      .update(events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(events.id, eventId))
      .returning();

    return rows[0];
  }

  async deleteOneById(eventId: string): Promise<Event> {
    const rows = await getDatabase().delete(events).where(eq(events.id, eventId)).returning();

    return rows[0];
  }

  async deleteManyByCalendarId(calendarId: string): Promise<Event[]> {
    const rows = await getDatabase()
      .delete(events)
      .where(eq(events.calendarId, calendarId))
      .returning();

    return rows;
  }

  async getCountsByCalendarIdsAndYear(calendarIds: string[], year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    if (calendarIds.length === 0) {
      return [];
    }

    const where = and(
      inArray(calendars.id, calendarIds),
      isNull(calendars.deletedAt),
      isNull(events.deletedAt),
      between(events.startsAt, startOfYear, endOfYear)
    );

    const startsAtDate = sql<Date>`DATE(${events.startsAt})`;
    const result = await getDatabase()
      .select({
        count: count(events.id).mapWith(Number),
        date: startsAtDate,
      })
      .from(events)
      .leftJoin(calendars, eq(events.calendarId, calendars.id))
      .where(where)
      .groupBy(startsAtDate)
      .execute();

    return result.map((row) => {
      return {
        date: format(new Date(row.date), 'yyyy-MM-dd'),
        count: row.count,
      };
    });
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(events.id).mapWith(Number),
      })
      .from(events)
      .where(and(eq(events.userId, userId), isNull(events.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async countByCalendarId(calendarId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(events.id).mapWith(Number),
      })
      .from(events)
      .where(and(eq(events.calendarId, calendarId), isNull(events.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  // Private
  private async _checkIfLimitReached(actorUser: User, calendarId: string) {
    const maxCount = await userUsageManager.getUserLimit(
      actorUser,
      'calendarsMaxEventsPerCalendarCount'
    );
    const currentCount = await eventsManager.countByCalendarId(calendarId);
    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of events per calendar (${maxCount}).`);
    }
  }
}

export const eventsManager = new EventsManager();

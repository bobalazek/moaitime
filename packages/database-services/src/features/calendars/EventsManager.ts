import { format } from 'date-fns';
import {
  and,
  asc,
  between,
  count,
  DBQueryConfig,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  lte,
  or,
  sql,
  SQL,
} from 'drizzle-orm';

import { calendars, Event, events, getDatabase, NewEvent } from '@moaitime/database-core';

export class EventsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Event[]> {
    return getDatabase().query.events.findMany(options);
  }

  async findManyByCalendarId(calendarId: string): Promise<Event[]> {
    return getDatabase().query.events.findMany({
      where: and(eq(events.calendarId, calendarId), isNull(events.deletedAt)),
    });
  }

  async findManyByCalendarIdsAndRange(
    calendarIds: string[],
    from?: Date,
    to?: Date
  ): Promise<(Event & { calendarColor: string | null })[]> {
    if (calendarIds.length === 0) {
      return [];
    }

    let where = and(
      inArray(calendars.id, calendarIds),
      isNull(calendars.deletedAt),
      isNull(events.deletedAt)
    );

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

    const result = await getDatabase()
      .select()
      .from(events)
      .leftJoin(calendars, eq(events.calendarId, calendars.id))
      .where(where)
      .orderBy(asc(events.startsAt))
      .execute();

    return result.map((row) => {
      return {
        ...row.events,
        calendarColor: row.calendars?.color ?? null,
      };
    });
  }

  async findOneById(id: string): Promise<Event | null> {
    const row = await getDatabase().query.events.findFirst({
      where: eq(events.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewEvent): Promise<Event> {
    const rows = await getDatabase().insert(events).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewEvent>): Promise<Event> {
    const rows = await getDatabase()
      .update(events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Event> {
    const rows = await getDatabase().delete(events).where(eq(events.id, id)).returning();

    return rows[0];
  }

  async deleteManyByCalendarId(calendarId: string): Promise<Event[]> {
    const rows = await getDatabase()
      .delete(events)
      .where(eq(events.calendarId, calendarId))
      .returning();

    return rows;
  }

  // Helpers
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
        date: format(row.date, 'yyyy-MM-dd'),
        count: row.count,
      };
    });
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

  async userCanView(userId: string, eventId: string): Promise<boolean> {
    const result = await getDatabase()
      .select()
      .from(events)
      .leftJoin(calendars, eq(events.calendarId, calendars.id))
      .where(and(eq(events.id, eventId), eq(calendars.userId, userId)))
      .limit(1)
      .execute();

    return result.length > 0;
  }

  async userCanUpdate(userId: string, calendarId: string): Promise<boolean> {
    return this.userCanView(userId, calendarId);
  }

  async userCanDelete(userId: string, calendarId: string): Promise<boolean> {
    return this.userCanUpdate(userId, calendarId);
  }
}

export const eventsManager = new EventsManager();

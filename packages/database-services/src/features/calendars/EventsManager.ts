import {
  and,
  asc,
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
  SQL,
} from 'drizzle-orm';

import { calendars, Event, events, getDatabase, NewEvent } from '@moaitime/database-core';

import { usersManager, UsersManager } from '../auth/UsersManager';

export class EventsManager {
  constructor(private _usersManager: UsersManager) {}

  async findMany(options?: DBQueryConfig<'many', true>): Promise<Event[]> {
    return getDatabase().query.events.findMany(options);
  }

  async findManyByCalendarId(calendarId: string): Promise<Event[]> {
    return getDatabase().query.events.findMany({
      where: and(eq(events.calendarId, calendarId), isNull(events.deletedAt)),
    });
  }

  async findManyByUserId(userId: string, from?: Date, to?: Date): Promise<Event[]> {
    const calendarIds = await this._usersManager.getVisibleCalendarIdsByUserId(userId);
    if (calendarIds.length === 0) {
      return [];
    }

    let where = and(inArray(calendars.id, calendarIds), isNull(events.deletedAt));

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
      return row.events;
    });
  }

  async findOneById(id: string): Promise<Event | null> {
    const row = await getDatabase().query.events.findFirst({
      where: eq(events.id, id),
    });

    return row ?? null;
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
}

export const eventsManager = new EventsManager(usersManager);

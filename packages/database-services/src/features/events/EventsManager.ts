import { DBQueryConfig, eq } from 'drizzle-orm';

import { calendars, Event, events, getDatabase, NewEvent } from '@myzenbuddy/database-core';

export class EventsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Event[]> {
    return getDatabase().query.events.findMany(options);
  }

  async findManyByCalendarId(calendarId: string): Promise<Event[]> {
    return getDatabase().query.events.findMany({
      where: eq(events.calendarId, calendarId),
    });
  }

  async findManyByUserId(userId: string): Promise<Event[]> {
    const result = await getDatabase()
      .select()
      .from(events)
      .leftJoin(calendars, eq(events.calendarId, calendars.id))
      .where(eq(calendars.userId, userId))
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

export const eventsManager = new EventsManager();

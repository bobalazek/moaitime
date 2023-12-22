import { and, asc, count, DBQueryConfig, desc, eq, isNotNull, isNull } from 'drizzle-orm';

import { Calendar, calendars, events, getDatabase, NewCalendar } from '@moaitime/database-core';

export class CalendarsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany({
      where: and(eq(calendars.userId, userId), isNull(calendars.deletedAt)),
      orderBy: asc(calendars.createdAt),
    });
  }

  async findManyDeletedByUserId(userId: string): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany({
      where: and(eq(calendars.userId, userId), isNotNull(calendars.deletedAt)),
      orderBy: desc(calendars.deletedAt),
    });
  }

  async findManyPublic(): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany({
      where: eq(calendars.isPublic, true),
      orderBy: asc(calendars.name),
    });
  }

  async findOneById(id: string): Promise<Calendar | null> {
    const row = await getDatabase().query.calendars.findFirst({
      where: eq(calendars.id, id),
    });

    return row ?? null;
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(calendars.id).mapWith(Number),
      })
      .from(calendars)
      .where(and(eq(calendars.userId, userId), isNull(calendars.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async insertOne(data: NewCalendar): Promise<Calendar> {
    const rows = await getDatabase().insert(calendars).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewCalendar>): Promise<Calendar> {
    const rows = await getDatabase()
      .update(calendars)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(calendars.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Calendar> {
    return getDatabase().transaction(async (tx) => {
      await tx.delete(events).where(eq(events.calendarId, id)).returning();

      const rows = await tx.delete(calendars).where(eq(calendars.id, id)).returning();

      return rows[0];
    });
  }

  // Helpers
  async userCanView(userId: string, calendarId: string): Promise<boolean> {
    const row = await getDatabase().query.calendars.findFirst({
      where: and(eq(calendars.id, calendarId), eq(calendars.userId, userId)),
    });

    return row !== null;
  }

  async userCanUpdate(userId: string, calendarId: string): Promise<boolean> {
    return this.userCanView(userId, calendarId);
  }

  async userCanDelete(userId: string, calendarId: string): Promise<boolean> {
    return this.userCanUpdate(userId, calendarId);
  }
}

export const calendarsManager = new CalendarsManager();

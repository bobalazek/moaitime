import { and, asc, count, DBQueryConfig, desc, eq, isNotNull, isNull } from 'drizzle-orm';

import {
  Calendar,
  calendars,
  events,
  getDatabase,
  NewCalendar,
  userCalendars,
} from '@moaitime/database-core';

import { UsersManager, usersManager } from '../auth/UsersManager';

export class CalendarsManager {
  static CUSTOM_CALENDARS_PREFIX = 'custom--';
  static CUSTOM_CALENDAR_IDS = [`${CalendarsManager.CUSTOM_CALENDARS_PREFIX}due-tasks`];

  constructor(private _usersManager: UsersManager) {}

  async findMany(options?: DBQueryConfig<'many', true>): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Calendar[]> {
    const data = await getDatabase().query.calendars.findMany({
      where: and(eq(calendars.userId, userId), isNull(calendars.deletedAt)),
      orderBy: asc(calendars.createdAt),
    });

    const now = new Date();
    data.push({
      id: `${CalendarsManager.CUSTOM_CALENDARS_PREFIX}due-tasks`,
      name: 'Due Tasks',
      description: null,
      color: null,
      timezone: 'UTC',
      isPublic: false,
      userId,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return data;
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
    if (calendarId.startsWith('custom--')) {
      return true;
    }

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

  async getVisibleCalendarIdsByUserId(userId: string): Promise<string[]> {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      return [];
    }

    const userSettings = this._usersManager.getUserSettings(user);
    const userCalendarIds = userSettings.calendarVisibleCalendarIds ?? [];
    const calendarIdsSet = new Set<string>();

    // Calendars
    const calendarRows = await getDatabase().query.calendars.findMany({
      columns: {
        id: true,
      },
      where: eq(calendars.userId, userId),
    });

    for (const row of calendarRows) {
      calendarIdsSet.add(row.id);
    }

    // User Calendars
    const userCalendarRows = await getDatabase().query.userCalendars.findMany({
      columns: {
        calendarId: true,
      },
      where: eq(userCalendars.userId, userId),
    });

    for (const row of userCalendarRows) {
      calendarIdsSet.add(row.calendarId);
    }

    if (!userCalendarIds.includes('*')) {
      const finalCalendarIds = new Set(userCalendarIds);

      for (const calendarId of calendarIdsSet) {
        if (finalCalendarIds.has(calendarId)) {
          continue;
        }

        calendarIdsSet.delete(calendarId);
      }
    }

    return Array.from(calendarIdsSet);
  }

  async addVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = this._usersManager.getUserSettings(user);
    const userCalendarIds = await this.getVisibleCalendarIdsByUserId(userId);

    if (
      userCalendarIds.includes(calendarId) &&
      !CalendarsManager.CUSTOM_CALENDAR_IDS.includes(calendarId)
    ) {
      return user;
    }

    userCalendarIds.push(calendarId);

    return this._usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });
  }

  async removeVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = this._usersManager.getUserSettings(user);
    const userCalendarIds = await this.getVisibleCalendarIdsByUserId(userId);

    if (
      !userCalendarIds.includes(calendarId) &&
      !CalendarsManager.CUSTOM_CALENDAR_IDS.includes(calendarId)
    ) {
      return user;
    }

    const index = userCalendarIds.indexOf(calendarId);
    if (index > -1) {
      userCalendarIds.splice(index, 1);
    }

    return this._usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });
  }
}

export const calendarsManager = new CalendarsManager(usersManager);

import { and, asc, count, DBQueryConfig, desc, eq, isNotNull, isNull } from 'drizzle-orm';

import {
  Calendar,
  calendars,
  events,
  getDatabase,
  NewCalendar,
  User,
  UserCalendar,
  userCalendars,
} from '@moaitime/database-core';
import { Calendar as ApiCalendar, UpdateUserCalendar } from '@moaitime/shared-common';

import { UsersManager, usersManager } from '../auth/UsersManager';

export class CalendarsManager {
  constructor(private _usersManager: UsersManager) {}

  async findMany(options?: DBQueryConfig<'many', true>): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Calendar[]> {
    const data = await getDatabase().query.calendars.findMany({
      where: and(eq(calendars.userId, userId), isNull(calendars.deletedAt)),
      orderBy: asc(calendars.createdAt),
    });

    return data;
  }

  async findManyDeletedByUserId(userId: string): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany({
      where: and(eq(calendars.userId, userId), isNotNull(calendars.deletedAt)),
      orderBy: desc(calendars.deletedAt),
    });
  }

  async findManySharedByUserId(userId: string): Promise<Calendar[]> {
    const result = await getDatabase()
      .select()
      .from(calendars)
      .leftJoin(userCalendars, eq(calendars.id, userCalendars.calendarId))
      .where(and(eq(userCalendars.userId, userId), isNull(calendars.deletedAt)))
      .execute();

    return result.map((row) => row.calendars);
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
  async userCanView(userId: string, calendarOrCalendarId: string | Calendar): Promise<boolean> {
    const calendar =
      typeof calendarOrCalendarId === 'string'
        ? await this.findOneById(calendarOrCalendarId)
        : calendarOrCalendarId;
    if (!calendar) {
      return false;
    }

    return calendar.userId === userId || calendar.isPublic;
  }

  async userCanUpdate(userId: string, calendarOrCalendarId: string | Calendar): Promise<boolean> {
    const calendar =
      typeof calendarOrCalendarId === 'string'
        ? await this.findOneById(calendarOrCalendarId)
        : calendarOrCalendarId;
    if (!calendar) {
      return false;
    }

    return calendar.userId === userId;
  }

  async userCanDelete(userId: string, calendarOrCalendarId: string | Calendar): Promise<boolean> {
    return this.userCanUpdate(userId, calendarOrCalendarId);
  }

  async userCanAddSharedCalendar(userId: string, calendarOrCalendarId: string | Calendar) {
    const calendar =
      typeof calendarOrCalendarId === 'string'
        ? await this.findOneById(calendarOrCalendarId)
        : calendarOrCalendarId;
    if (!calendar) {
      return false;
    }

    return calendar.isPublic;
  }

  async userCanUpdateSharedCalendar(userId: string, calendarOrCalendarId: string | Calendar) {
    // TODO: this will do far too many queries. Cache and fix it!

    const userCalendar = await this.getSharedCalendar(
      userId,
      typeof calendarOrCalendarId === 'string' ? calendarOrCalendarId : calendarOrCalendarId.id
    );

    console.log(userCalendar);

    return !!userCalendar;
  }

  // Settings
  async getUserSettingsCalendarIds(userOrUserId: string | User): Promise<string[]> {
    const user =
      typeof userOrUserId === 'string'
        ? await this._usersManager.findOneById(userOrUserId)
        : userOrUserId;
    if (!user) {
      return [];
    }

    const userSettings = this._usersManager.getUserSettings(user);

    return userSettings.calendarVisibleCalendarIds ?? [];
  }

  // Visible
  async getVisibleCalendarIdsByUserId(userId: string): Promise<string[]> {
    const userCalendarIds = await this.getUserSettingsCalendarIds(userId);
    const idsSet = new Set<string>();

    // Calendars
    const rows = await this.findMany({
      columns: {
        id: true,
      },
      where: eq(calendars.userId, userId),
    });

    for (const row of rows) {
      idsSet.add(row.id);
    }

    // User Calendars
    const userCalendarRows = await getDatabase().query.userCalendars.findMany({
      columns: {
        calendarId: true,
      },
      where: eq(userCalendars.userId, userId),
    });

    for (const row of userCalendarRows) {
      idsSet.add(row.calendarId);
    }

    // Check
    if (!userCalendarIds.includes('*')) {
      const finalIds = new Set(userCalendarIds);

      for (const id of idsSet) {
        if (finalIds.has(id)) {
          continue;
        }

        idsSet.delete(id);
      }
    }

    return Array.from(idsSet);
  }

  async addVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const user = await this._usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = this._usersManager.getUserSettings(user);
    const userCalendarIds = await this.getVisibleCalendarIdsByUserId(userId);
    if (userCalendarIds.includes(calendarId)) {
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
    if (!userCalendarIds.includes(calendarId)) {
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

  // Shared
  async getSharedCalendar(userId: string, calendarId: string): Promise<UserCalendar | null> {
    const row = await getDatabase().query.userCalendars.findFirst({
      where: and(eq(userCalendars.userId, userId), eq(userCalendars.calendarId, calendarId)),
    });

    return row ?? null;
  }

  async addSharedCalendarToUser(userId: string, calendarId: string) {
    const canView = await this.userCanAddSharedCalendar(userId, calendarId);
    if (!canView) {
      return;
    }

    const row = await getDatabase().query.userCalendars.findFirst({
      where: and(eq(userCalendars.userId, userId), eq(userCalendars.calendarId, calendarId)),
    });

    if (row) {
      return;
    }

    await getDatabase().insert(userCalendars).values({ userId, calendarId }).execute();

    await this.addVisibleCalendarIdByUserId(userId, calendarId);
  }

  async removeSharedCalendarFromUser(userId: string, calendarId: string) {
    await getDatabase()
      .delete(userCalendars)
      .where(and(eq(userCalendars.userId, userId), eq(userCalendars.calendarId, calendarId)))
      .execute();

    await this.removeVisibleCalendarIdByUserId(userId, calendarId);
  }

  async updateSharedCalendar(userId: string, calendarId: string, data: UpdateUserCalendar) {
    const canView = await this.userCanAddSharedCalendar(userId, calendarId);
    if (!canView) {
      return;
    }

    const userCalendar = await getDatabase().query.userCalendars.findFirst({
      where: and(eq(userCalendars.userId, userId), eq(userCalendars.calendarId, calendarId)),
    });

    if (!userCalendar) {
      return;
    }

    await getDatabase()
      .update(userCalendars)
      .set(data)
      .where(eq(userCalendars.id, userCalendar.id))
      .execute();
  }

  // Permissions
  async getCalendarPermissions(
    userId: string,
    calendarOrCalendarId: string | Calendar
  ): Promise<ApiCalendar['permissions']> {
    const canView = await this.userCanView(userId, calendarOrCalendarId);
    const canUpdate = await this.userCanUpdate(userId, calendarOrCalendarId);
    const canDelete = await this.userCanDelete(userId, calendarOrCalendarId);
    const canAddSharedCalendar = await this.userCanAddSharedCalendar(userId, calendarOrCalendarId);
    const canUpdateSharedCalendar = await this.userCanUpdateSharedCalendar(
      userId,
      calendarOrCalendarId
    );

    return {
      canView,
      canUpdate,
      canDelete,
      canAddSharedCalendar,
      canUpdateSharedCalendar,
    };
  }

  async convertToApiResponse(calendars: Calendar[], userId: string): Promise<ApiCalendar[]> {
    const apiCalendars: ApiCalendar[] = [];

    for (const calendar of calendars) {
      const permissions = await this.getCalendarPermissions(userId, calendar);

      apiCalendars.push({
        ...calendar,
        userId: calendar.userId!,
        deletedAt: calendar.deletedAt?.toISOString() ?? null,
        createdAt: calendar.createdAt!.toISOString(),
        updatedAt: calendar.updatedAt!.toISOString(),
        permissions,
      });
    }

    return apiCalendars;
  }
}

export const calendarsManager = new CalendarsManager(usersManager);

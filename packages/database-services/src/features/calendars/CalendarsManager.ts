import {
  and,
  asc,
  count,
  DBQueryConfig,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  or,
  SQL,
} from 'drizzle-orm';

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
import {
  Calendar as ApiCalendar,
  UserCalendar as ApiUserCalendar,
  CreateCalendar,
  UpdateCalendar,
  UpdateUserCalendar,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export type CalendarsManagerVisibleCalendarsMap = Map<string, 'user' | 'team' | 'user-shared'>;

export class CalendarsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Calendar[]> {
    return getDatabase().query.calendars.findMany(options);
  }

  async findManyByUserIdAndTheirTeams(userId: string): Promise<Calendar[]> {
    let where = isNull(calendars.deletedAt);

    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length === 0) {
      where = and(where, eq(calendars.userId, userId)) as SQL<unknown>;
    } else {
      where = and(
        where,
        or(eq(calendars.userId, userId), inArray(calendars.teamId, teamIds))
      ) as SQL<unknown>;
    }

    const data = await getDatabase().query.calendars.findMany({
      where,
      orderBy: asc(calendars.createdAt),
    });

    return data;
  }

  async findOneByIdAndUserId(calendarId: string | null, userId: string): Promise<Calendar | null> {
    let where = and(
      calendarId ? eq(calendars.id, calendarId) : isNull(calendars.id),
      isNull(calendars.deletedAt)
    );

    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length === 0) {
      where = and(where, eq(calendars.userId, userId)) as SQL<unknown>;
    } else {
      where = and(
        where,
        or(eq(calendars.userId, userId), inArray(calendars.teamId, teamIds))
      ) as SQL<unknown>;
    }

    const row = await getDatabase().query.calendars.findFirst({
      where,
    });

    return row ?? null;
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

  async countByTeamId(teamId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(calendars.id).mapWith(Number),
      })
      .from(calendars)
      .where(and(eq(calendars.teamId, teamId), isNull(calendars.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async countUserCalendarsByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userCalendars.id).mapWith(Number),
      })
      .from(userCalendars)
      .where(eq(userCalendars.userId, userId))
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

  // Permissions
  async userCanView(userId: string, calendarOrCalendarId: string | Calendar): Promise<boolean> {
    const calendar =
      typeof calendarOrCalendarId === 'string'
        ? await this.findOneById(calendarOrCalendarId)
        : calendarOrCalendarId;
    if (!calendar) {
      return false;
    }

    if (calendar.userId === userId || calendar.isPublic) {
      return true;
    }

    const teamIds = await usersManager.getTeamIds(userId);
    if (calendar.teamId && teamIds.includes(calendar.teamId)) {
      return true;
    }

    return false;
  }

  async userCanUpdate(userId: string, calendarOrCalendarId: string | Calendar): Promise<boolean> {
    const calendar =
      typeof calendarOrCalendarId === 'string'
        ? await this.findOneById(calendarOrCalendarId)
        : calendarOrCalendarId;
    if (!calendar) {
      return false;
    }

    if (calendar.userId === userId) {
      return true;
    }

    const teamIds = await usersManager.getTeamIds(userId);
    if (calendar.teamId && teamIds.includes(calendar.teamId)) {
      return true;
    }

    return false;
  }

  async userCanDelete(userId: string, calendarOrCalendarId: string | Calendar): Promise<boolean> {
    return this.userCanUpdate(userId, calendarOrCalendarId);
  }

  // Helpers
  async list(userId: string) {
    const calendars = await this.findManyByUserIdAndTheirTeams(userId);

    return this.convertToApiResponse(calendars, userId);
  }

  async listDeleted(userId: string) {
    const calendars = await this.findManyDeletedByUserId(userId);

    return this.convertToApiResponse(calendars, userId);
  }

  async listPublic(userId: string) {
    const calendars = await this.findManyPublic();

    return this.convertToApiResponse(calendars, userId);
  }

  async create(user: User, createData: CreateCalendar) {
    const calendarsMaxPerUserCount = await usersManager.getUserLimit(
      user,
      'calendarsMaxPerUserCount'
    );

    const calendarsCount = await this.countByUserId(user.id);
    if (calendarsCount >= calendarsMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of calendars per user (${calendarsMaxPerUserCount}).`
      );
    }

    const data = await this.insertOne({
      ...createData,
      userId: user.id,
    });

    await this.addVisibleCalendarIdByUserId(user.id, data.id);

    return data;
  }

  async update(userId: string, calendarId: string, body: UpdateCalendar) {
    const canUpdate = await this.userCanUpdate(userId, calendarId);
    if (!canUpdate) {
      throw new Error('You cannot update this calendar');
    }

    return this.updateOneById(calendarId, body);
  }

  async delete(userId: string, calendarId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(userId, calendarId);
    if (!canDelete) {
      throw new Error('You cannot delete this calendar');
    }

    return isHardDelete
      ? this.deleteOneById(calendarId)
      : this.updateOneById(calendarId, {
          deletedAt: new Date(),
        });
  }

  async undelete(userId: string, calendarId: string) {
    const canDelete = await this.userCanUpdate(userId, calendarId);
    if (!canDelete) {
      throw new Error('You cannot undelete this calendar');
    }

    return this.updateOneById(calendarId, {
      deletedAt: null,
    });
  }

  async addVisible(userId: string, calendarId: string) {
    const canView = await this.userCanView(userId, calendarId);
    if (!canView) {
      throw new Error('You cannot view this calendar');
    }

    return this.addVisibleCalendarIdByUserId(userId, calendarId);
  }

  async removeVisible(userId: string, calendarId: string) {
    return this.removeVisibleCalendarIdByUserId(userId, calendarId);
  }

  // Visible
  async getVisibleCalendarIdsByUserIdMap(
    userId: string
  ): Promise<CalendarsManagerVisibleCalendarsMap> {
    const userCalendarIds = await this.getUserSettingsCalendarIds(userId);
    const idsMap: CalendarsManagerVisibleCalendarsMap = new Map();

    // Calendars
    const rows = await this.findMany({
      columns: {
        id: true,
      },
      where: eq(calendars.userId, userId),
    });

    for (const row of rows) {
      idsMap.set(row.id, 'user');
    }

    // Team Calendars
    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length > 0) {
      const teamLists = await this.findMany({
        columns: {
          id: true,
        },
        where: inArray(calendars.teamId, teamIds),
      });

      for (const row of teamLists) {
        idsMap.set(row.id, 'team');
      }
    }

    // User Calendars
    const userCalendarRows = await getDatabase().query.userCalendars.findMany({
      columns: {
        calendarId: true,
      },
      where: eq(userCalendars.userId, userId),
    });

    for (const row of userCalendarRows) {
      idsMap.set(row.calendarId, 'user-shared');
    }

    // Check
    if (!userCalendarIds.includes('*')) {
      const finalIds = new Set(userCalendarIds);

      for (const id of idsMap.keys()) {
        if (finalIds.has(id)) {
          continue;
        }

        idsMap.delete(id);
      }
    }

    return idsMap;
  }

  async addVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const user = await usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = usersManager.getUserSettings(user);
    const userCalendarIdsMap = await this.getVisibleCalendarIdsByUserIdMap(userId);
    const userCalendarIds = Array.from(userCalendarIdsMap.keys());
    if (userCalendarIds.includes(calendarId)) {
      return user;
    }

    userCalendarIds.push(calendarId);

    return usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });
  }

  async removeVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const user = await usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = usersManager.getUserSettings(user);
    const userCalendarIdsMap = await this.getVisibleCalendarIdsByUserIdMap(userId);
    const userCalendarIds = Array.from(userCalendarIdsMap.keys());
    if (!userCalendarIds.includes(calendarId)) {
      return user;
    }

    const index = userCalendarIds.indexOf(calendarId);
    if (index > -1) {
      userCalendarIds.splice(index, 1);
    }

    return usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });
  }

  // User Calendars
  async listUserCalendars(userId: string) {
    return calendarsManager.getUserCalendars(userId);
  }

  async createUserCalendar(user: User, calendarId: string) {
    const calendarsMaxUserCalendarsPerUserCount = await usersManager.getUserLimit(
      user,
      'calendarsMaxUserCalendarsPerUserCount'
    );

    const calendarsCount = await calendarsManager.countUserCalendarsByUserId(user.id);
    if (calendarsCount >= calendarsMaxUserCalendarsPerUserCount) {
      throw new Error(
        `You have reached the maximum number of shared calendars per user (${calendarsMaxUserCalendarsPerUserCount}).`
      );
    }

    const canView = await calendarsManager.userCanView(user.id, calendarId);
    if (!canView) {
      throw new Error('You cannot add this calendar');
    }

    return calendarsManager.addUserCalendarToUser(user.id, calendarId);
  }

  async getUserCalendars(userId: string): Promise<ApiUserCalendar[]> {
    const rows = await getDatabase()
      .select()
      .from(userCalendars)
      .leftJoin(calendars, eq(userCalendars.calendarId, calendars.id))
      .where(eq(userCalendars.userId, userId))
      .orderBy(asc(calendars.name))
      .execute();

    const result: ApiUserCalendar[] = [];
    for (const row of rows) {
      const { calendars, user_calendars } = row;
      const calendar = calendars as Calendar;
      const apiCalendars = await this.convertToApiResponse([calendar], userId);

      result.push({
        ...user_calendars,
        calendar: apiCalendars[0],
        createdAt: user_calendars.createdAt!.toISOString(),
        updatedAt: user_calendars.updatedAt!.toISOString(),
      });
    }

    return result;
  }

  async getUserCalendar(userId: string, userCalendarId: string): Promise<UserCalendar | null> {
    const row = await getDatabase().query.userCalendars.findFirst({
      where: and(eq(userCalendars.id, userCalendarId), eq(userCalendars.userId, userId)),
    });

    return row ?? null;
  }

  async addUserCalendarToUser(userId: string, calendarId: string) {
    const row = await getDatabase().query.userCalendars.findFirst({
      where: and(eq(userCalendars.userId, userId), eq(userCalendars.calendarId, calendarId)),
    });

    if (row) {
      return;
    }

    await getDatabase().insert(userCalendars).values({ userId, calendarId }).execute();

    await this.addVisibleCalendarIdByUserId(userId, calendarId);
  }

  async deleteUserCalendar(userId: string, userCalendarId: string) {
    const userCalendar = await this.getUserCalendar(userId, userCalendarId);
    if (!userCalendar) {
      return;
    }

    await getDatabase().delete(userCalendars).where(eq(userCalendars.id, userCalendarId)).execute();

    await this.removeVisibleCalendarIdByUserId(userId, userCalendar.calendarId);
  }

  async updateUserCalendar(userId: string, userCalendarId: string, data: UpdateUserCalendar) {
    const userCalendar = await this.getUserCalendar(userId, userCalendarId);
    if (!userCalendar) {
      return;
    }

    await getDatabase()
      .update(userCalendars)
      .set(data)
      .where(eq(userCalendars.id, userCalendar.id))
      .execute();
  }

  async getCalendarPermissions(
    userId: string,
    calendarOrCalendarId: string | Calendar
  ): Promise<ApiCalendar['permissions']> {
    const canView = await this.userCanView(userId, calendarOrCalendarId);
    const canUpdate = await this.userCanUpdate(userId, calendarOrCalendarId);
    const canDelete = await this.userCanDelete(userId, calendarOrCalendarId);

    return {
      canView,
      canUpdate,
      canDelete,
    };
  }

  async getUserSettingsCalendarIds(userOrUserId: string | User): Promise<string[]> {
    const user =
      typeof userOrUserId === 'string'
        ? await usersManager.findOneById(userOrUserId)
        : userOrUserId;
    if (!user) {
      return [];
    }

    const userSettings = usersManager.getUserSettings(user);

    return userSettings.calendarVisibleCalendarIds ?? [];
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

export const calendarsManager = new CalendarsManager();

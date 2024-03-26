import { and, asc, count, desc, eq, inArray, isNotNull, isNull, or, SQL } from 'drizzle-orm';

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
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  Calendar as ApiCalendar,
  UserCalendar as ApiUserCalendar,
  CreateCalendar,
  GlobalEventsEnum,
  UpdateCalendar,
  UpdateUserCalendar,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export type CalendarsManagerVisibleCalendarsMap = Map<string, 'user' | 'team' | 'user-shared'>;

export class CalendarsManager {
  // API Helpers
  async list(actorUserId: string) {
    const calendars = await this.findManyByUserId(actorUserId);

    return this.convertToApiResponse(calendars, actorUserId);
  }

  async listDeleted(actorUserId: string) {
    const calendars = await this.findManyDeletedByUserId(actorUserId);

    return this.convertToApiResponse(calendars, actorUserId);
  }

  async listPublic(actorUserId: string) {
    const calendars = await this.findManyPublic();

    return this.convertToApiResponse(calendars, actorUserId);
  }

  async create(actorUser: User, data: CreateCalendar) {
    await this._checkIfLimitReached(actorUser);

    const calendar = await this.insertOne({
      ...data,
      userId: actorUser.id,
    });

    await this.addVisibleCalendarIdByUserId(actorUser.id, calendar.id);

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_CALENDAR_ADDED, {
      actorUserId: actorUser.id,
      calendarId: calendar.id,
      teamId: calendar.teamId ?? undefined,
    });

    return calendar;
  }

  async update(actorUserId: string, calendarId: string, body: UpdateCalendar) {
    const canUpdate = await this.userCanUpdate(actorUserId, calendarId);
    if (!canUpdate) {
      throw new Error('You cannot update this calendar');
    }

    const calendar = await this.updateOneById(calendarId, body);

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_CALENDAR_EDITED, {
      actorUserId,
      calendarId: calendar.id,
      teamId: calendar.teamId ?? undefined,
    });

    return calendar;
  }

  async delete(actorUserId: string, calendarId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(actorUserId, calendarId);
    if (!canDelete) {
      throw new Error('You cannot delete this calendar');
    }

    const calendar = isHardDelete
      ? await this.deleteOneById(calendarId)
      : await this.updateOneById(calendarId, {
          deletedAt: new Date(),
        });

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_CALENDAR_DELETED, {
      actorUserId,
      calendarId: calendar.id,
      teamId: calendar.teamId ?? undefined,
      isHardDelete,
    });

    return calendar;
  }

  async undelete(actorUser: User, calendarId: string) {
    const canDelete = await this.userCanUpdate(actorUser.id, calendarId);
    if (!canDelete) {
      throw new Error('You cannot undelete this calendar');
    }

    await this._checkIfLimitReached(actorUser);

    const calendar = await this.updateOneById(calendarId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_CALENDAR_UNDELETED, {
      actorUserId: actorUser.id,
      calendarId: calendar.id,
      teamId: calendar.teamId ?? undefined,
    });

    return calendar;
  }

  async addVisible(actorUserId: string, calendarId: string) {
    const canView = await this.userCanView(actorUserId, calendarId);
    if (!canView) {
      throw new Error('You cannot view this calendar');
    }

    const calendar = await this.addVisibleCalendarIdByUserId(actorUserId, calendarId);
    if (calendar) {
      globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_CALENDAR_ADD_VISIBLE, {
        actorUserId,
        calendarId: calendar.id,
        teamId: calendar.teamId ?? undefined,
      });
    }

    return calendar;
  }

  async removeVisible(actorUserId: string, calendarId: string) {
    const calendar = await this.removeVisibleCalendarIdByUserId(actorUserId, calendarId);
    if (calendar) {
      globalEventsNotifier.publish(GlobalEventsEnum.CALENDAR_CALENDAR_REMOVE_VISIBLE, {
        actorUserId,
        calendarId: calendar.id,
        teamId: calendar.teamId ?? undefined,
      });
    }

    return calendar;
  }

  async getVisibleCalendarIdsByUserIdMap(
    userId: string
  ): Promise<CalendarsManagerVisibleCalendarsMap> {
    const userCalendarIds = await this.getUserSettingsCalendarIds(userId);
    const idsMap: CalendarsManagerVisibleCalendarsMap = new Map();

    // Calendars
    const rows = await getDatabase().query.calendars.findMany({
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
      const teamLists = await getDatabase().query.calendars.findMany({
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
    const calendar = await this.findOneById(calendarId);

    const user = await usersManager.findOneById(userId);
    if (!user) {
      return calendar;
    }

    const userSettings = usersManager.getUserSettings(user);
    const userCalendarIdsMap = await this.getVisibleCalendarIdsByUserIdMap(userId);
    const userCalendarIds = Array.from(userCalendarIdsMap.keys());
    if (userCalendarIds.includes(calendarId)) {
      return calendar;
    }

    userCalendarIds.push(calendarId);

    await usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });

    return calendar;
  }

  async removeVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const calendar = await this.findOneById(calendarId);

    const user = await usersManager.findOneById(userId);
    if (!user) {
      return calendar;
    }

    const userSettings = usersManager.getUserSettings(user);
    const userCalendarIdsMap = await this.getVisibleCalendarIdsByUserIdMap(userId);
    const userCalendarIds = Array.from(userCalendarIdsMap.keys());
    if (!userCalendarIds.includes(calendarId)) {
      return calendar;
    }

    const index = userCalendarIds.indexOf(calendarId);
    if (index > -1) {
      userCalendarIds.splice(index, 1);
    }

    await usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });

    return calendar;
  }

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

    // Pretty much the same check as above, except above we always return true if the calendar is public
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
  async findManyByUserId(userId: string): Promise<Calendar[]> {
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

  async findOneByIdAndUserId(calendarId: string, userId: string): Promise<Calendar | null> {
    let where = and(eq(calendars.id, calendarId), isNull(calendars.deletedAt));

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

  // Private
  private async _checkIfLimitReached(actorUser: User) {
    const maxCount = await usersManager.getUserLimit(actorUser, 'calendarsMaxPerUserCount');
    const currentCount = await this.countByUserId(actorUser.id);
    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of calendars per user (${maxCount}).`);
    }
  }
}

export const calendarsManager = new CalendarsManager();

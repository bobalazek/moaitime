import { format } from 'date-fns';
import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  calendars,
  getDatabase,
  NewUser,
  User,
  userCalendars,
  users,
} from '@moaitime/database-core';
import { DEFAULT_USER_SETTINGS, UserSettings } from '@moaitime/shared-common';

export class UsersManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<User[]> {
    const rows = await getDatabase().query.users.findMany(options);

    return rows.map((row) => {
      return this._fixBirthDateColumn(row);
    });
  }

  async findOneById(id: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!row) {
      return null;
    }

    return this._fixBirthDateColumn(row);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!row) {
      return null;
    }

    return this._fixBirthDateColumn(row);
  }

  async findOneByEmailConfirmationToken(emailConfirmationToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.emailConfirmationToken, emailConfirmationToken),
    });

    if (!row) {
      return null;
    }

    return this._fixBirthDateColumn(row);
  }

  async findOneByNewEmailConfirmationToken(
    newEmailConfirmationToken: string
  ): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.newEmailConfirmationToken, newEmailConfirmationToken),
    });

    if (!row) {
      return null;
    }

    return this._fixBirthDateColumn(row);
  }

  async findOneByPasswordResetToken(passwordResetToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.passwordResetToken, passwordResetToken),
    });

    if (!row) {
      return null;
    }

    return this._fixBirthDateColumn(row);
  }

  async insertOne(data: NewUser): Promise<User> {
    const rows = await getDatabase().insert(users).values(data).returning();

    return this._fixBirthDateColumn(rows[0]);
  }

  async updateOneById(id: string, data: Partial<NewUser>): Promise<User> {
    const rows = await getDatabase()
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return this._fixBirthDateColumn(rows[0]);
  }

  async deleteOneById(id: string): Promise<User> {
    const rows = await getDatabase().delete(users).where(eq(users.id, id)).returning();

    return this._fixBirthDateColumn(rows[0]);
  }

  // Custom
  getUserSettings(user: User): UserSettings {
    return {
      ...DEFAULT_USER_SETTINGS,
      ...(user.settings ?? {}),
    };
  }

  async getVisibleCalendarIdsByUserId(userId: string): Promise<string[]> {
    const user = await this.findOneById(userId);
    if (!user) {
      return [];
    }

    const userSettings = this.getUserSettings(user);
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
    const user = await this.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = this.getUserSettings(user);
    const userCalendarIds = await this.getVisibleCalendarIdsByUserId(userId);

    if (userCalendarIds.includes(calendarId)) {
      return user;
    }

    userCalendarIds.push(calendarId);

    return this.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });
  }

  async removeVisibleCalendarIdByUserId(userId: string, calendarId: string) {
    const user = await this.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = this.getUserSettings(user);
    const userCalendarIds = await this.getVisibleCalendarIdsByUserId(userId);

    if (!userCalendarIds.includes(calendarId)) {
      return user;
    }

    const index = userCalendarIds.indexOf(calendarId);
    userCalendarIds.splice(index, 1);

    return this.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleCalendarIds: userCalendarIds,
      },
    });
  }

  // Helpers
  private _fixBirthDateColumn(user: User) {
    // TODO
    // Bug in drizzle: https://github.com/drizzle-team/drizzle-orm/issues/1185.
    // Should actually be a string
    if (user.birthDate && (user.birthDate as unknown as Date) instanceof Date) {
      user.birthDate = format(user.birthDate as unknown as Date, 'yyyy-MM-dd');
    }

    return user;
  }
}

export const usersManager = new UsersManager();

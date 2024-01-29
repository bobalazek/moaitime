import { format } from 'date-fns';
import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, NewUser, User, users } from '@moaitime/database-core';
import {
  DEFAULT_USER_SETTINGS,
  UserLimits,
  UserSettings,
  UserUsage,
} from '@moaitime/shared-common';

import { calendarsManager } from '../calendars/CalendarsManager';
import { eventsManager } from '../calendars/EventsManager';
import { focusSessionsManager } from '../focus/FocusSessionsManager';
import { moodEntriesManager } from '../mood/MoodEntriesManager';
import { notesManager } from '../notes/NotesManager';
import { listsManager } from '../tasks/ListsManager';
import { tagsManager } from '../tasks/TagsManager';
import { tasksManager } from '../tasks/TasksManager';

export class UsersManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<User[]> {
    const rows = await getDatabase().query.users.findMany(options);

    return rows.map((row) => {
      return this._fixRowColumns(row);
    });
  }

  async findOneById(id: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByEmailConfirmationToken(emailConfirmationToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.emailConfirmationToken, emailConfirmationToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
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

    return this._fixRowColumns(row);
  }

  async findOneByPasswordResetToken(passwordResetToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.passwordResetToken, passwordResetToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByDeletionToken(deletionToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.deletionToken, deletionToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async insertOne(data: NewUser): Promise<User> {
    const rows = await getDatabase().insert(users).values(data).returning();

    return this._fixRowColumns(rows[0]);
  }

  async updateOneById(id: string, data: Partial<NewUser>): Promise<User> {
    const rows = await getDatabase()
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return this._fixRowColumns(rows[0]);
  }

  async deleteOneById(id: string): Promise<User> {
    const rows = await getDatabase().delete(users).where(eq(users.id, id)).returning();

    return this._fixRowColumns(rows[0]);
  }

  // Helpers
  getUserSettings(user: User): UserSettings {
    return {
      ...DEFAULT_USER_SETTINGS,
      ...(user.settings ?? {}),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLimits(user: User): Promise<UserLimits> {
    // TODO: once we have plans, we need to adjust the limits depending on that

    return {
      teamsMaxPerUserCount: 1,
      tasksMaxPerListCount: 10,
      listsMaxPerUserCount: 10,
      tagsMaxPerUserCount: 10,
      calendarsMaxPerUserCount: 10,
      calendarsMaxEventsPerCalendarCount: 100,
      calendarsMaxUserCalendarsPerUserCount: 5,
      notesMaxPerUserCount: 10,
    };
  }

  async getUserLimit(user: User, key: keyof UserLimits): Promise<number> {
    const limits = await this.getUserLimits(user);

    return limits[key];
  }

  async getUserUsage(user: User): Promise<UserUsage> {
    // TODO: cache!

    const listsCount = await listsManager.countByUserId(user.id);
    const tasksCount = await tasksManager.countByUserId(user.id);
    const notesCount = await notesManager.countByUserId(user.id);
    const moodEntriesCount = await moodEntriesManager.countByUserId(user.id);
    const calendarsCount = await calendarsManager.countByUserId(user.id);
    const userCalendarsCount = await calendarsManager.countUserCalendarsByUserId(user.id);
    const eventsCount = await eventsManager.countByUserId(user.id);
    const tagsCount = await tagsManager.countByUserId(user.id);
    const focusSessionsCount = await focusSessionsManager.countByUserId(user.id);

    const usage = {
      listsCount,
      tasksCount,
      notesCount,
      moodEntriesCount,
      calendarsCount,
      userCalendarsCount,
      eventsCount,
      tagsCount,
      focusSessionsCount,
    };

    return usage;
  }

  // Private
  private _fixRowColumns(user: User) {
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

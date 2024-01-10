import { format } from 'date-fns';
import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, NewUser, User, users } from '@moaitime/database-core';
import { DEFAULT_USER_SETTINGS, UserSettings } from '@moaitime/shared-common';

export type UserLimits = {
  tasksMaxPerListCount: number;
  listsMaxPerUserCount: number;
  tagsMaxPerUserCount: number;
  calendarsMaxPerUserCount: number;
  calendarsMaxEventsPerCalendarCount: number;
  notesMaxPerUserCount: number;
};

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

  // Custom
  getUserSettings(user: User): UserSettings {
    return {
      ...DEFAULT_USER_SETTINGS,
      ...(user.settings ?? {}),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLimits(user: User, key: keyof UserLimits): Promise<number> {
    // TODO: once we have plans, we need to adjust the limits depending on that

    const limits: UserLimits = {
      tasksMaxPerListCount: 50,
      listsMaxPerUserCount: 10,
      tagsMaxPerUserCount: 20,
      calendarsMaxPerUserCount: 10,
      calendarsMaxEventsPerCalendarCount: 500,
      notesMaxPerUserCount: 100,
    };

    return limits[key];
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

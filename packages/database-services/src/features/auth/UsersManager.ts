import { format } from 'date-fns';
import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, NewUser, User, users } from '@myzenbuddy/database-core';

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

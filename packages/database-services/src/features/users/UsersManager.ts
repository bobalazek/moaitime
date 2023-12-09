import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabaseClient,
  insertUserSchema,
  NewUser,
  updateUserSchema,
  User,
  users,
} from '@myzenbuddy/database-core';

export class UsersManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<User[]> {
    return getDatabaseClient().query.users.findMany(options);
  }

  async findOneById(id: string): Promise<User | null> {
    const row = await getDatabaseClient().query.users.findFirst({
      where: eq(users.id, id),
    });

    return row ?? null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const row = await getDatabaseClient().query.users.findFirst({
      where: eq(users.email, email),
    });

    return row ?? null;
  }

  async findOneByEmailConfirmationToken(emailConfirmationToken: string): Promise<User | null> {
    const row = await getDatabaseClient().query.users.findFirst({
      where: eq(users.emailConfirmationToken, emailConfirmationToken),
    });

    return row ?? null;
  }

  async findOneByNewEmailConfirmationToken(
    newEmailConfirmationToken: string
  ): Promise<User | null> {
    const row = await getDatabaseClient().query.users.findFirst({
      where: eq(users.newEmailConfirmationToken, newEmailConfirmationToken),
    });

    return row ?? null;
  }

  async findOneByPasswordResetToken(passwordResetToken: string): Promise<User | null> {
    const row = await getDatabaseClient().query.users.findFirst({
      where: eq(users.passwordResetToken, passwordResetToken),
    });

    return row ?? null;
  }

  async insertOne(data: NewUser): Promise<User> {
    data = insertUserSchema.parse(data) as unknown as NewUser;

    const rows = await getDatabaseClient().insert(users).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUser>): Promise<User> {
    data = updateUserSchema.parse(data) as unknown as NewUser;

    const rows = await getDatabaseClient()
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<User> {
    const rows = await getDatabaseClient().delete(users).where(eq(users.id, id)).returning();

    return rows[0];
  }
}

export const usersManager = new UsersManager();

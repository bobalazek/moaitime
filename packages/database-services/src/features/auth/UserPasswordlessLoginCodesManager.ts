import { and, eq, gt, isNull, or } from 'drizzle-orm';

import {
  getDatabase,
  NewUserPasswordlessLogin,
  UserPasswordlessLogin,
  userPasswordlessLogins,
} from '@moaitime/database-core';

export class UserPasswordlessLoginsManager {
  // Helpers
  async findOneById(userAccessTokenId: string): Promise<UserPasswordlessLogin | null> {
    const row = await getDatabase().query.userPasswordlessLogins.findFirst({
      where: eq(userPasswordlessLogins.id, userAccessTokenId),
    });

    return row ?? null;
  }

  async findOneByToken(token: string): Promise<UserPasswordlessLogin | null> {
    const row = await getDatabase().query.userPasswordlessLogins.findFirst({
      where: eq(userPasswordlessLogins.token, token),
    });

    return row ?? null;
  }

  async findCurrentlyActiveForUserId(
    userId: string,
    now = new Date()
  ): Promise<UserPasswordlessLogin | null> {
    const where = and(
      eq(userPasswordlessLogins.userId, userId),
      isNull(userPasswordlessLogins.acceptedAt),
      isNull(userPasswordlessLogins.rejectedAt),
      or(isNull(userPasswordlessLogins.expiresAt), gt(userPasswordlessLogins.expiresAt, now))
    );

    const row = await getDatabase().query.userPasswordlessLogins.findFirst({
      where,
    });

    return row ?? null;
  }

  async insertOne(data: NewUserPasswordlessLogin): Promise<UserPasswordlessLogin> {
    const rows = await getDatabase().insert(userPasswordlessLogins).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    userPasswordlessLoginId: string,
    data: Partial<NewUserPasswordlessLogin>
  ): Promise<UserPasswordlessLogin> {
    const rows = await getDatabase()
      .update(userPasswordlessLogins)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userPasswordlessLogins.id, userPasswordlessLoginId))
      .returning();

    return rows[0];
  }

  async updateOneByUserId(
    userId: string,
    data: Partial<NewUserPasswordlessLogin>
  ): Promise<UserPasswordlessLogin> {
    const rows = await getDatabase()
      .update(userPasswordlessLogins)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userPasswordlessLogins.userId, userId))
      .returning();

    return rows[0];
  }

  async deleteOneById(userAccessTokenId: string): Promise<UserPasswordlessLogin> {
    const rows = await getDatabase()
      .delete(userPasswordlessLogins)
      .where(eq(userPasswordlessLogins.id, userAccessTokenId))
      .returning();

    return rows[0];
  }
}

export const userPasswordlessLoginsManager = new UserPasswordlessLoginsManager();

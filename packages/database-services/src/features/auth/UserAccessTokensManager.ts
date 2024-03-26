import { eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserAccessToken,
  User,
  UserAccessToken,
  userAccessTokens,
} from '@moaitime/database-core';

export class UserAccessTokensManager {
  // Helpers
  async findOneById(userAccessTokenId: string): Promise<UserAccessToken | null> {
    const row = await getDatabase().query.userAccessTokens.findFirst({
      where: eq(userAccessTokens.id, userAccessTokenId),
    });

    return row ?? null;
  }

  async findOneByToken(token: string): Promise<UserAccessToken | null> {
    const row = await getDatabase().query.userAccessTokens.findFirst({
      where: eq(userAccessTokens.token, token),
    });

    return row ?? null;
  }

  async findOneByRefreshToken(
    refreshToken: string
  ): Promise<(UserAccessToken & { user: User }) | null> {
    const row = await getDatabase().query.userAccessTokens.findFirst({
      where: eq(userAccessTokens.refreshToken, refreshToken),
      with: {
        user: true,
      },
    });

    return row ?? null;
  }

  async insertOne(data: NewUserAccessToken): Promise<UserAccessToken> {
    const rows = await getDatabase().insert(userAccessTokens).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    userAccessTokenId: string,
    data: Partial<NewUserAccessToken>
  ): Promise<UserAccessToken> {
    const rows = await getDatabase()
      .update(userAccessTokens)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userAccessTokens.id, userAccessTokenId))
      .returning();

    return rows[0];
  }

  async updateOneByUserId(
    userId: string,
    data: Partial<NewUserAccessToken>
  ): Promise<UserAccessToken> {
    const rows = await getDatabase()
      .update(userAccessTokens)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userAccessTokens.userId, userId))
      .returning();

    return rows[0];
  }

  async deleteOneById(userAccessTokenId: string): Promise<UserAccessToken> {
    const rows = await getDatabase()
      .delete(userAccessTokens)
      .where(eq(userAccessTokens.id, userAccessTokenId))
      .returning();

    return rows[0];
  }
}

export const userAccessTokensManager = new UserAccessTokensManager();

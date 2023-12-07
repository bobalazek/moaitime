import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  databaseClient,
  insertUserAccessTokenSchema,
  NewUserAccessToken,
  updateUserAccessTokenSchema,
  User,
  UserAccessToken,
  userAccessTokens,
} from '@myzenbuddy/database-core';

export class UserAccessTokensManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserAccessToken[]> {
    return databaseClient.query.userAccessTokens.findMany(options);
  }

  async findOneById(id: string): Promise<UserAccessToken | null> {
    const row = await databaseClient.query.userAccessTokens.findFirst({
      where: eq(userAccessTokens.id, id),
    });

    return row ?? null;
  }

  async findOneByToken(token: string): Promise<UserAccessToken | null> {
    const row = await databaseClient.query.userAccessTokens.findFirst({
      where: eq(userAccessTokens.token, token),
    });

    return row ?? null;
  }

  async findOneByRefreshToken(
    refreshToken: string
  ): Promise<(UserAccessToken & { user: User }) | null> {
    const row = await databaseClient.query.userAccessTokens.findFirst({
      where: eq(userAccessTokens.refreshToken, refreshToken),
      with: {
        user: true,
      },
    });

    return row ?? null;
  }

  async insertOne(data: NewUserAccessToken): Promise<UserAccessToken> {
    data = insertUserAccessTokenSchema.parse(data) as unknown as NewUserAccessToken;

    const rows = await databaseClient.insert(userAccessTokens).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUserAccessToken>): Promise<UserAccessToken> {
    data = updateUserAccessTokenSchema.parse(data) as unknown as NewUserAccessToken;

    const rows = await databaseClient
      .update(userAccessTokens)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userAccessTokens.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserAccessToken> {
    const rows = await databaseClient
      .delete(userAccessTokens)
      .where(eq(userAccessTokens.id, id))
      .returning();

    return rows[0];
  }
}

export const userAccessTokensManager = new UserAccessTokensManager();

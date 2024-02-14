import { DBQueryConfig, desc, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserActivityEntry,
  userActivityEntries,
  UserActivityEntry,
} from '@moaitime/database-core';

export class UserActivityEntriesManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserActivityEntry[]> {
    return getDatabase().query.userActivityEntries.findMany(options);
  }

  async findOneById(id: string): Promise<UserActivityEntry | null> {
    const row = await getDatabase().query.userActivityEntries.findFirst({
      where: eq(userActivityEntries.id, id),
    });

    return row ?? null;
  }

  async findOneLatestByUserId(userId: string): Promise<UserActivityEntry | null> {
    const row = await getDatabase().query.userActivityEntries.findFirst({
      where: eq(userActivityEntries.userId, userId),
      orderBy: desc(userActivityEntries.lastActiveAt),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserActivityEntry): Promise<UserActivityEntry> {
    const rows = await getDatabase().insert(userActivityEntries).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUserActivityEntry>): Promise<UserActivityEntry> {
    const rows = await getDatabase()
      .update(userActivityEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userActivityEntries.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserActivityEntry> {
    const rows = await getDatabase()
      .delete(userActivityEntries)
      .where(eq(userActivityEntries.id, id))
      .returning();

    return rows[0];
  }

  // Helpers
  async getLastActiveAtByUserId(userId: string): Promise<Date | null> {
    const latestEntry = await this.findOneLatestByUserId(userId);

    return latestEntry?.lastActiveAt ?? null;
  }

  async updateUserLastActiveAtById(
    userId: string,
    toleranceSeconds: number = 120
  ): Promise<UserActivityEntry> {
    const now = new Date();
    const latestEntry = await this.findOneLatestByUserId(userId);

    if (
      latestEntry &&
      latestEntry.lastActiveAt!.getTime() > now.getTime() - toleranceSeconds * 1000
    ) {
      return this.updateOneById(latestEntry.id, {
        lastActiveAt: now,
      });
    }

    return this.insertOne({
      userId,
    });
  }
}

export const userActivityEntriesManager = new UserActivityEntriesManager();

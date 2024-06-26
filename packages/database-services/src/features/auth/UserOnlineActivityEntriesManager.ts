import { desc, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserOnlineActivityEntry,
  userOnlineActivityEntries,
  UserOnlineActivityEntry,
} from '@moaitime/database-core';

export class UserOnlineActivityEntriesManager {
  // Helpers
  async findOneById(userOnlineActivityEntryId: string): Promise<UserOnlineActivityEntry | null> {
    const row = await getDatabase().query.userOnlineActivityEntries.findFirst({
      where: eq(userOnlineActivityEntries.id, userOnlineActivityEntryId),
    });

    return row ?? null;
  }

  async findOneLatestByUserId(userId: string): Promise<UserOnlineActivityEntry | null> {
    const row = await getDatabase().query.userOnlineActivityEntries.findFirst({
      where: eq(userOnlineActivityEntries.userId, userId),
      orderBy: desc(userOnlineActivityEntries.lastActiveAt),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserOnlineActivityEntry): Promise<UserOnlineActivityEntry> {
    const rows = await getDatabase().insert(userOnlineActivityEntries).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    userOnlineActivityEntryId: string,
    data: Partial<NewUserOnlineActivityEntry>
  ): Promise<UserOnlineActivityEntry> {
    const rows = await getDatabase()
      .update(userOnlineActivityEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userOnlineActivityEntries.id, userOnlineActivityEntryId))
      .returning();

    return rows[0];
  }

  async deleteOneById(userOnlineActivityEntryId: string): Promise<UserOnlineActivityEntry> {
    const rows = await getDatabase()
      .delete(userOnlineActivityEntries)
      .where(eq(userOnlineActivityEntries.id, userOnlineActivityEntryId))
      .returning();

    return rows[0];
  }

  async getLastActiveAtByUserId(userId: string): Promise<string | null> {
    const latestEntry = await this.findOneLatestByUserId(userId);

    return latestEntry?.lastActiveAt?.toISOString() ?? null;
  }

  async updateUserLastActiveAtById(
    userId: string,
    toleranceSeconds: number = 120
  ): Promise<UserOnlineActivityEntry> {
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

export const userOnlineActivityEntriesManager = new UserOnlineActivityEntriesManager();

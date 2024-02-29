import { and, DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserAchievement,
  UserAchievement,
  userAchievementEntries,
  UserAchievementEntry,
  userAchievements,
} from '@moaitime/database-core';
import { AchievementEnum } from '@moaitime/shared-common';

export class UserAchievementsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserAchievement[]> {
    return getDatabase().query.userAchievements.findMany(options);
  }

  async findOneById(id: string): Promise<UserAchievement | null> {
    const row = await getDatabase().query.userAchievements.findFirst({
      where: eq(userAchievements.id, id),
    });

    return row ?? null;
  }

  async findOneByUserIdAndAchievementKey(
    userId: string,
    achievementKey: AchievementEnum
  ): Promise<UserAchievement | null> {
    const row = await getDatabase().query.userAchievements.findFirst({
      where: and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementKey, achievementKey)
      ),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserAchievement): Promise<UserAchievement> {
    const rows = await getDatabase().insert(userAchievements).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUserAchievement>): Promise<UserAchievement> {
    const rows = await getDatabase()
      .update(userAchievements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userAchievements.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserAchievement> {
    const rows = await getDatabase()
      .delete(userAchievements)
      .where(eq(userAchievements.id, id))
      .returning();

    return rows[0];
  }

  // Helpers
  async addOrUpdateAchievementForUser(
    userId: string,
    achievementKey: AchievementEnum,
    points: number,
    key: string, // this is basically an index that will be created for the userAchievementEntries table, to prevent awarding achievements for the same thing multiple times
    data?: Record<string, unknown>
  ): Promise<UserAchievementEntry | null> {
    let userAchievement = await this.findOneByUserIdAndAchievementKey(userId, achievementKey);
    if (!userAchievement) {
      userAchievement = await this.addAchievementToUser(userId, achievementKey, points);
    }

    const userAchievementEntry = await getDatabase().query.userAchievementEntries.findFirst({
      where: and(
        eq(userAchievementEntries.userAchievementId, userAchievement.id),
        eq(userAchievementEntries.key, key)
      ),
    });
    if (userAchievementEntry) {
      return null;
    }

    const rows = await getDatabase()
      .insert(userAchievementEntries)
      .values({
        key,
        points,
        data,
        userAchievementId: userAchievement.id,
      })
      .returning();
    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to create user achievement entry');
    }

    userAchievement = await this.updateAchievement(userAchievement.id, {
      points: userAchievement.points + points,
    });

    return row;
  }

  async addAchievementToUser(
    userId: string,
    achievementKey: AchievementEnum,
    points: number
  ): Promise<UserAchievement> {
    return this.insertOne({
      userId,
      achievementKey,
      points,
    });
  }

  async updateAchievement(
    userAchievementId: string,
    data: Partial<NewUserAchievement>
  ): Promise<UserAchievement> {
    const userAchievement = await this.findOneById(userAchievementId);
    if (!userAchievement) {
      throw new Error(`Achievement with ID "${userAchievementId}" not found`);
    }

    return this.updateOneById(userAchievement.id, data);
  }

  async removeAchievement(userAchievementId: string): Promise<UserAchievement> {
    return this.deleteOneById(userAchievementId);
  }
}

export const userAchievementsManager = new UserAchievementsManager();

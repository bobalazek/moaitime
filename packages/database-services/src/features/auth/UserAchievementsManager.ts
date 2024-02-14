import { and, DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserAchievement,
  UserAchievement,
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

  async updateAchievement(id: string, points: number): Promise<UserAchievement> {
    const achievement = await this.findOneById(id);
    if (!achievement) {
      throw new Error(`Achievement with ID "${id}" not found`);
    }

    return this.updateOneById(achievement.id, { points });
  }

  async removeAchievement(id: string): Promise<UserAchievement> {
    return this.deleteOneById(id);
  }
}

export const userAchievementsManager = new UserAchievementsManager();

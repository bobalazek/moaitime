import { and, DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserAchievement,
  UserAchievement,
  userAchievementEntries,
  UserAchievementEntry,
  userAchievements,
} from '@moaitime/database-core';
import { AchievementEnum, AchievementsMap } from '@moaitime/shared-common';

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
  ): Promise<{
    userAchievementEntry: UserAchievementEntry | null;
    userAchievementPreviousLevel: number;
    userAchievementNewLevel: number;
  }> {
    let newlyCreatedAchievement = false;
    let userAchievement = await this.findOneByUserIdAndAchievementKey(userId, achievementKey);
    if (!userAchievement) {
      userAchievement = await this.addAchievementToUser(userId, achievementKey, points);
      newlyCreatedAchievement = true;
    }

    const userAchievementPreviousLevel = this._getLevelForUserAchievement(userAchievement);

    const userAchievementEntry = await getDatabase().query.userAchievementEntries.findFirst({
      where: and(
        eq(userAchievementEntries.userAchievementId, userAchievement.id),
        eq(userAchievementEntries.key, key)
      ),
    });
    if (userAchievementEntry) {
      return {
        userAchievementEntry,
        userAchievementPreviousLevel: newlyCreatedAchievement ? 0 : userAchievementPreviousLevel,
        userAchievementNewLevel: userAchievementPreviousLevel,
      };
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

    const userAchievementNewLevel = this._getLevelForUserAchievement(userAchievement);

    return {
      userAchievementEntry: row,
      userAchievementPreviousLevel,
      userAchievementNewLevel,
    };
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

  // Private
  private _getLevelForUserAchievement(userAchievement: UserAchievement) {
    const achievement = AchievementsMap.get(userAchievement.achievementKey);
    if (!achievement) {
      throw new Error(`Achievement with key "${userAchievement.achievementKey}" not found`);
    }

    const levelPoints = achievement.levelPoints;
    let level = 0;
    for (let i = 0; i < levelPoints.length; i++) {
      if (userAchievement.points >= levelPoints[i]) {
        level = i + 1;
      }
    }

    return level;
  }
}

export const userAchievementsManager = new UserAchievementsManager();

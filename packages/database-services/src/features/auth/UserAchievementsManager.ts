import { and, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserAchievement,
  UserAchievement,
  userAchievementEntries,
  UserAchievementEntry,
  userAchievements,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { AchievementEnum, AchievementsMap, GlobalEventsEnum } from '@moaitime/shared-common';

export class UserAchievementsManager {
  // Helpers
  async findOneById(userAchievementId: string): Promise<UserAchievement | null> {
    const row = await getDatabase().query.userAchievements.findFirst({
      where: eq(userAchievements.id, userAchievementId),
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

  async updateOneById(
    userAchievementId: string,
    data: Partial<NewUserAchievement>
  ): Promise<UserAchievement> {
    const rows = await getDatabase()
      .update(userAchievements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userAchievements.id, userAchievementId))
      .returning();

    return rows[0];
  }

  async deleteOneById(userAchievementId: string): Promise<UserAchievement> {
    const rows = await getDatabase()
      .delete(userAchievements)
      .where(eq(userAchievements.id, userAchievementId))
      .returning();

    return rows[0];
  }

  async addOrUpdateAchievementForUser(
    userId: string,
    achievementKey: AchievementEnum,
    points: number,
    pointsAction: 'add' | 'set' = 'add',
    key: string, // this is basically an index that will be created for the userAchievementEntries table, to prevent awarding achievements for the same thing multiple times
    data?: Record<string, unknown>
  ): Promise<{
    userAchievementEntry: UserAchievementEntry | null;
    userAchievementPreviousLevel: number;
    userAchievementNewLevel: number;
  }> {
    let isNewlyCreatedAchievement = false;
    let userAchievement = await this.findOneByUserIdAndAchievementKey(userId, achievementKey);
    let userAchievementPreviousLevel = userAchievement
      ? this._getLevelForUserAchievement(userAchievement)
      : 0;

    if (pointsAction === 'set' && points === 0) {
      if (userAchievement) {
        await userAchievementsManager.removeAchievement(userId, userAchievement.id);
      }

      return {
        userAchievementEntry: null,
        userAchievementPreviousLevel,
        userAchievementNewLevel: 0,
      };
    }

    if (!userAchievement) {
      userAchievement = await this.addAchievementToUser(userId, achievementKey, points);
      isNewlyCreatedAchievement = true;
      userAchievementPreviousLevel = 0;
    }

    const userAchievementEntry = await getDatabase().query.userAchievementEntries.findFirst({
      where: and(
        eq(userAchievementEntries.userAchievementId, userAchievement.id),
        eq(userAchievementEntries.key, key)
      ),
    });
    if (userAchievementEntry) {
      return {
        userAchievementEntry,
        userAchievementPreviousLevel,
        userAchievementNewLevel: this._getLevelForUserAchievement(userAchievement),
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
    const newUserAchievementEntry = rows[0] ?? null;
    if (!newUserAchievementEntry) {
      throw new Error('Failed to create user achievement entry');
    }

    const newPoints =
      pointsAction === 'set' || isNewlyCreatedAchievement
        ? points
        : userAchievement.points + points;

    userAchievement = await this.updateAchievement(userId, userAchievement.id, {
      points: newPoints,
    });

    const userAchievementNewLevel = this._getLevelForUserAchievement(userAchievement);

    return {
      userAchievementEntry: newUserAchievementEntry,
      userAchievementPreviousLevel,
      userAchievementNewLevel,
    };
  }

  async addAchievementToUser(
    userId: string,
    achievementKey: AchievementEnum,
    points: number
  ): Promise<UserAchievement> {
    const userAchievement = await this.insertOne({
      userId,
      achievementKey,
      points,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_ADDED, {
      actorUserId: userId,
      userAchievementId: userAchievement.id,
    });

    return userAchievement;
  }

  async updateAchievement(
    userId: string,
    userAchievementId: string,
    data: Partial<NewUserAchievement>
  ): Promise<UserAchievement> {
    const userAchievement = await this.findOneById(userAchievementId);
    if (!userAchievement) {
      throw new Error(`Achievement with ID "${userAchievementId}" not found`);
    }

    const updatedUserAchievement = await this.updateOneById(userAchievement.id, data);

    globalEventsNotifier.publish(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_UPDATED, {
      actorUserId: userId,
      userAchievementId: userAchievement.id,
    });

    return updatedUserAchievement;
  }

  async removeAchievement(userId: string, userAchievementId: string): Promise<UserAchievement> {
    const deletedUserAchievement = await this.deleteOneById(userAchievementId);

    globalEventsNotifier.publish(GlobalEventsEnum.ACHIEVEMENTS_ACHIEVEMENT_DELETED, {
      actorUserId: userId,
      userAchievementId: deletedUserAchievement.id,
    });

    return deletedUserAchievement;
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

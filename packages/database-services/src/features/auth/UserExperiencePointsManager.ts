import { eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserExperiencePoint,
  UserExperiencePoint,
  userExperiencePoints,
} from '@moaitime/database-core';
import { Entity } from '@moaitime/shared-common';

export class UserExperiencePointsManager {
  // Helpers
  async findOneById(userExperiencePointId: string): Promise<UserExperiencePoint | null> {
    const row = await getDatabase().query.userExperiencePoints.findFirst({
      where: eq(userExperiencePoints.id, userExperiencePointId),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserExperiencePoint): Promise<UserExperiencePoint> {
    const rows = await getDatabase().insert(userExperiencePoints).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    userExperiencePointId: string,
    data: Partial<NewUserExperiencePoint>
  ): Promise<UserExperiencePoint> {
    const rows = await getDatabase()
      .update(userExperiencePoints)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userExperiencePoints.id, userExperiencePointId))
      .returning();

    return rows[0];
  }

  async deleteOneById(userExperiencePointId: string): Promise<UserExperiencePoint> {
    const rows = await getDatabase()
      .delete(userExperiencePoints)
      .where(eq(userExperiencePoints.id, userExperiencePointId))
      .returning();

    return rows[0];
  }

  async addExperiencePointsToUser(
    userId: string,
    type: string,
    amount: number,
    relatedEntities?: Entity[],
    data?: Record<string, unknown>
  ): Promise<UserExperiencePoint> {
    return this.insertOne({
      userId,
      type,
      amount,
      relatedEntities,
      data,
    });
  }
}

export const userExperiencePointsManager = new UserExperiencePointsManager();

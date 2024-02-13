import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserExperiencePoint,
  UserExperiencePoint,
  userExperiencePoints,
} from '@moaitime/database-core';

export class UserExperiencePointsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserExperiencePoint[]> {
    return getDatabase().query.userExperiencePoints.findMany(options);
  }

  async findOneById(id: string): Promise<UserExperiencePoint | null> {
    const row = await getDatabase().query.userExperiencePoints.findFirst({
      where: eq(userExperiencePoints.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserExperiencePoint): Promise<UserExperiencePoint> {
    const rows = await getDatabase().insert(userExperiencePoints).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    id: string,
    data: Partial<NewUserExperiencePoint>
  ): Promise<UserExperiencePoint> {
    const rows = await getDatabase()
      .update(userExperiencePoints)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userExperiencePoints.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserExperiencePoint> {
    const rows = await getDatabase()
      .delete(userExperiencePoints)
      .where(eq(userExperiencePoints.id, id))
      .returning();

    return rows[0];
  }

  // Helpers
  async addExperiencePointsToUser(
    userId: string,
    type: string,
    amount: number,
    relatedEntities?: string[],
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

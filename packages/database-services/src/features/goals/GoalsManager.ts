import { and, asc, count, desc, eq, ilike, isNotNull, isNull, SQL } from 'drizzle-orm';

import { getDatabase, Goal, goals, NewGoal, User } from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { CreateGoal, GlobalEventsEnum, UpdateGoal } from '@moaitime/shared-common';

import { userUsageManager } from '../auth/UserUsageManager';

export type GoalsManagerFindManyOptions = {
  search?: string;
  includeDeleted?: boolean;
};

export class GoalsManager {
  // API Helpers
  async list(actorUserId: string, options?: GoalsManagerFindManyOptions) {
    return this.findManyByUserId(actorUserId, options);
  }

  async listDeleted(actorUserId: string) {
    return this.findManyDeletedByUserId(actorUserId);
  }

  async view(actorUserId: string, goalId: string) {
    const canView = await this.userCanView(actorUserId, goalId);
    if (!canView) {
      throw new Error('You cannot view this goal');
    }

    const data = await this.findOneById(goalId);
    if (!data) {
      throw new Error('Goal not found');
    }

    return data;
  }

  async create(actorUser: User, data: CreateGoal) {
    await this._checkIfLimitReached(actorUser);

    const maxOrder = await this.getMaxOrderForUserId(actorUser.id);
    const order = maxOrder + 1;

    const goal = await this.insertOne({
      ...data,
      order,
      targetCompletedAt: data.targetCompletedAt ? new Date(data.targetCompletedAt) : null,
      userId: actorUser.id,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.GOALS_GOAL_ADDED, {
      actorUserId: actorUser.id,
      goalId: goal.id,
    });

    return goal;
  }

  async update(actorUserId: string, goalId: string, data: UpdateGoal) {
    const canView = await this.userCanUpdate(actorUserId, goalId);
    if (!canView) {
      throw new Error('You cannot update this goal');
    }

    const goal = await this.findOneById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    const updatedGoal = await this.updateOneById(goalId, {
      ...data,
      targetCompletedAt: data.targetCompletedAt ? new Date(data.targetCompletedAt) : null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.GOALS_GOAL_EDITED, {
      actorUserId,
      goalId: updatedGoal.id,
    });

    return updatedGoal;
  }

  async delete(actorUserId: string, goalId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(actorUserId, goalId);
    if (!canDelete) {
      throw new Error('You cannot delete this goal');
    }

    const deletedGoal = isHardDelete
      ? await this.deleteOneById(goalId)
      : await this.updateOneById(goalId, {
          deletedAt: new Date(),
        });

    globalEventsNotifier.publish(GlobalEventsEnum.GOALS_GOAL_DELETED, {
      actorUserId,
      goalId: deletedGoal.id,
    });

    return deletedGoal;
  }

  async undelete(actorUser: User, goalId: string) {
    const canDelete = await this.userCanUpdate(actorUser.id, goalId);
    if (!canDelete) {
      throw new Error('You cannot undelete this goal');
    }

    await this._checkIfLimitReached(actorUser);

    const undeletedGoal = await this.updateOneById(goalId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.GOALS_GOAL_UNDELETED, {
      actorUserId: actorUser.id,
      goalId: undeletedGoal.id,
    });

    return undeletedGoal;
  }

  async reorder(
    actorUserId: string,
    options: {
      originalGoalId: string;
      newGoalId: string;
    }
  ) {
    const { originalGoalId, newGoalId } = options;

    await this.reorderGoals(actorUserId, originalGoalId, newGoalId);

    globalEventsNotifier.publish(GlobalEventsEnum.GOALS_REORDERED, {
      actorUserId: actorUserId,
    });
  }

  async complete(actorUserId: string, goalId: string) {
    const goal = await this.findOneById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    return this.updateOneById(goalId, {
      completedAt: new Date(),
    });
  }

  async uncomplete(actorUserId: string, goalId: string) {
    const goal = await this.findOneById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    return this.updateOneById(goalId, {
      completedAt: null,
    });
  }

  // Permissions
  async userCanView(userId: string, goalId: string): Promise<boolean> {
    const row = await getDatabase().query.goals.findFirst({
      where: eq(goals.id, goalId),
    });

    if (!row) {
      return false;
    }

    if (row.userId === userId) {
      return true;
    }

    return false;
  }

  async userCanUpdate(userId: string, goalId: string): Promise<boolean> {
    return this.userCanView(userId, goalId);
  }

  async userCanDelete(userId: string, goalId: string): Promise<boolean> {
    return this.userCanUpdate(userId, goalId);
  }

  // Helpers
  async findManyByUserId(userId: string, options?: GoalsManagerFindManyOptions): Promise<Goal[]> {
    const orderBy = asc(goals.order);
    let where: SQL<unknown> = eq(goals.userId, userId) as SQL<unknown>;

    if (options?.search) {
      where = and(where, ilike(goals.name, `%${options.search}%`)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(goals.deletedAt)) as SQL<unknown>;
    }

    return getDatabase().query.goals.findMany({
      where,
      orderBy,
    });
  }

  async findManyDeletedByUserId(userId: string): Promise<Goal[]> {
    return getDatabase().query.goals.findMany({
      where: and(eq(goals.userId, userId), isNotNull(goals.deletedAt)),
      orderBy: desc(goals.createdAt),
    });
  }

  async findOneById(goalId: string): Promise<Goal | null> {
    const row = await getDatabase().query.goals.findFirst({
      where: eq(goals.id, goalId),
    });

    return row ?? null;
  }

  async insertOne(data: NewGoal): Promise<Goal> {
    const rows = await getDatabase().insert(goals).values(data).returning();

    return rows[0];
  }

  async updateOneById(goalId: string, data: Partial<NewGoal>): Promise<Goal> {
    const rows = await getDatabase()
      .update(goals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(goals.id, goalId))
      .returning();

    return rows[0];
  }

  async deleteOneById(goalId: string): Promise<Goal> {
    const rows = await getDatabase().delete(goals).where(eq(goals.id, goalId)).returning();

    return rows[0];
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(goals.id).mapWith(Number),
      })
      .from(goals)
      .where(and(eq(goals.userId, userId), isNull(goals.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async reorderGoals(userId: string, originalGoalId: string, newGoalId: string) {
    const result = await this.findManyByUserId(userId, {
      includeDeleted: true,
    });

    const originalIndex = result.findIndex((entry) => entry.id === originalGoalId);
    const newIndex = result.findIndex((entry) => entry.id === newGoalId);
    if (originalIndex === -1 || newIndex === -1) {
      throw new Error('Goal not found.');
    }

    const [movedEntry] = result.splice(originalIndex, 1);
    result.splice(newIndex, 0, movedEntry);

    const reorderMap: Record<string, number> = {};
    result.forEach((entry, index) => {
      reorderMap[entry.id] = index;
    });

    await getDatabase().transaction(async (tx) => {
      for (const entryId in reorderMap) {
        await tx.update(goals).set({ order: reorderMap[entryId] }).where(eq(goals.id, entryId));
      }
    });
  }

  async getMaxOrderForUserId(userId: string): Promise<number> {
    const rows = await getDatabase()
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.order))
      .limit(1)
      .execute();

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].order ?? 0;
  }

  // Private
  private async _checkIfLimitReached(actorUser: User) {
    const goalsMaxPerUserCount = await userUsageManager.getUserLimit(
      actorUser,
      'goalsMaxPerUserCount'
    );
    const goalsCount = await this.countByUserId(actorUser.id);
    if (goalsCount >= goalsMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of goals per user (${goalsMaxPerUserCount}).`
      );
    }
  }
}

export const goalsManager = new GoalsManager();

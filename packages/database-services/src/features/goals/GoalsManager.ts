import { and, asc, count, desc, eq, ilike, isNull, SQL } from 'drizzle-orm';

import { getDatabase, Goal, goals, NewGoal, User } from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  CreateGoal,
  GlobalEventsEnum,
  GoalsListSortFieldEnum,
  SortDirectionEnum,
  UpdateGoal,
} from '@moaitime/shared-common';

import { userUsageManager } from '../auth/UserUsageManager';

export type GoalsManagerFindManyOptions = {
  search?: string;
  sortField?: GoalsListSortFieldEnum;
  sortDirection?: SortDirectionEnum;
  includeDeleted?: boolean;
};

export class GoalsManager {
  // API Helpers
  async list(actorUserId: string, options?: GoalsManagerFindManyOptions) {
    return this.findManyByUserId(actorUserId, options);
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

    const goal = await this.insertOne({
      ...data,
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

    const updatedGoal = await this.updateOneById(goalId, data);

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
    let where: SQL<unknown> = eq(goals.userId, userId) as SQL<unknown>;
    let orderBy = desc(goals.createdAt);

    if (options?.search) {
      where = and(where, ilike(goals.name, `%${options.search}%`)) as SQL<unknown>;
    }

    if (options?.sortField) {
      const direction = options?.sortDirection ?? SortDirectionEnum.ASC;
      const field = goals[options.sortField] ?? goals.name;

      orderBy = direction === SortDirectionEnum.ASC ? asc(field) : desc(field);
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(goals.deletedAt)) as SQL<unknown>;
    }

    return getDatabase().query.goals.findMany({
      where,
      orderBy,
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

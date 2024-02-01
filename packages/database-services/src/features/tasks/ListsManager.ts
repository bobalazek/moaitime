import { and, asc, count, DBQueryConfig, desc, eq, inArray, isNull, or, SQL } from 'drizzle-orm';

import { getDatabase, List, lists, NewList, tasks, User } from '@moaitime/database-core';
import { CreateList, UpdateList } from '@moaitime/shared-common';

import { teamsManager } from '../auth/TeamsManager';
import { usersManager } from '../auth/UsersManager';

export type ListsManagerTaskCountOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
};

export class ListsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<List[]> {
    return getDatabase().query.lists.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<List[]> {
    let where = isNull(lists.deletedAt);

    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length === 0) {
      where = and(where, eq(lists.userId, userId)) as SQL<unknown>;
    } else {
      where = and(
        where,
        or(eq(lists.userId, userId), inArray(lists.teamId, teamIds))
      ) as SQL<unknown>;
    }

    const result = await getDatabase().query.lists.findMany({
      where,
      orderBy: [desc(lists.order), asc(lists.createdAt)],
    });

    return result;
  }

  async findOneById(id: string): Promise<List | null> {
    const row = await getDatabase().query.lists.findFirst({
      where: eq(lists.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(listId: string, userId: string): Promise<List | null> {
    let where = and(eq(lists.id, listId), isNull(lists.deletedAt));

    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length === 0) {
      where = and(where, eq(lists.userId, userId)) as SQL<unknown>;
    } else {
      where = and(
        where,
        or(eq(lists.userId, userId), inArray(lists.teamId, teamIds))
      ) as SQL<unknown>;
    }

    const row = await getDatabase().query.lists.findFirst({
      where,
    });

    return row ?? null;
  }

  async insertOne(data: NewList): Promise<List> {
    const rows = await getDatabase().insert(lists).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewList>): Promise<List> {
    const rows = await getDatabase()
      .update(lists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lists.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<List> {
    const rows = await getDatabase().delete(lists).where(eq(lists.id, id)).returning();

    return rows[0];
  }

  // Permissions
  async userCanView(userId: string, listId: string): Promise<boolean> {
    const row = await getDatabase().query.lists.findFirst({
      where: and(eq(lists.id, listId), eq(lists.userId, userId)),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, listId: string): Promise<boolean> {
    return this.userCanView(userId, listId);
  }

  async userCanDelete(userId: string, listId: string): Promise<boolean> {
    return this.userCanUpdate(userId, listId);
  }

  // Helpers
  async list(userId: string) {
    return this.findManyByUserId(userId);
  }

  async view(userId: string, listId: string) {
    const canView = await this.userCanView(listId, userId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    const data = await this.findOneByIdAndUserId(listId, userId);
    if (!data) {
      throw new Error('List not found');
    }

    return data;
  }

  async create(user: User, data: CreateList) {
    let listsMaxCount = 0;
    let listsCount = 0;

    if (data.teamId) {
      const team = await teamsManager.findOneById(data.teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      listsMaxCount = await teamsManager.getTeamLimit(team, 'listsMaxPerTeamCount');
      listsCount = await this.countByTeamId(team.id);
    } else {
      listsMaxCount = await usersManager.getUserLimit(user, 'listsMaxPerUserCount');
      listsCount = await this.countByUserId(user.id);
    }

    if (listsCount >= listsMaxCount) {
      throw new Error(`You have reached the maximum number of lists per user (${listsMaxCount}).`);
    }

    return this.insertOne({ ...data, userId: user.id });
  }

  async update(userId: string, listId: string, data: UpdateList) {
    const canUpdate = await this.userCanUpdate(userId, listId);
    if (!canUpdate) {
      throw new Error('You cannot update this list');
    }

    return this.updateOneById(listId, data);
  }

  async delete(userId: string, listId: string) {
    const canDelete = await this.userCanDelete(userId, listId);
    if (!canDelete) {
      throw new Error('You cannot delete this list');
    }

    return this.updateOneById(listId, {
      deletedAt: new Date(),
    });
  }

  async addVisible(userId: string, listId: string) {
    const canView = await this.userCanView(userId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    await this.addVisibleListIdByUserId(userId, listId);
  }

  async removeVisible(userId: string, listId: string) {
    const canView = await this.userCanView(userId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    await this.removeVisibleListIdByUserId(userId, listId);
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(lists.id).mapWith(Number),
      })
      .from(lists)
      .where(and(eq(lists.userId, userId), isNull(lists.teamId), isNull(lists.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async countByTeamId(teamId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(lists.id).mapWith(Number),
      })
      .from(lists)
      .where(and(eq(lists.teamId, teamId), isNull(lists.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async getTasksCountMap(userId: string, options?: ListsManagerTaskCountOptions) {
    const lists = await this.findManyByUserId(userId);
    const listIds = lists.map((list) => list.id);

    const tasksCountMap = new Map<string | null, number>();

    let where = inArray(tasks.listId, listIds);
    if (!options?.includeCompleted) {
      where = and(where, isNull(tasks.completedAt)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(tasks.deletedAt)) as SQL<unknown>;
    }

    const tasksCountData = await getDatabase()
      .select({
        listId: tasks.listId,
        tasksCount: count(tasks.id).mapWith(Number),
      })
      .from(tasks)
      .where(where)
      .groupBy(tasks.listId)
      .execute();
    for (const item of tasksCountData) {
      tasksCountMap.set(item.listId, item.tasksCount);
    }

    // Separate query for tasks without list
    let whereWithoutList = and(isNull(tasks.listId), eq(tasks.userId, userId));
    if (!options?.includeCompleted) {
      whereWithoutList = and(whereWithoutList, isNull(tasks.completedAt)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      whereWithoutList = and(whereWithoutList, isNull(tasks.deletedAt)) as SQL<unknown>;
    }

    const tasksWithoutListCountData = await getDatabase()
      .select({
        tasksCount: count(tasks.id).mapWith(Number),
      })
      .from(tasks)
      .where(whereWithoutList)
      .groupBy(tasks.listId)
      .execute();
    if (tasksWithoutListCountData.length > 0) {
      tasksCountMap.set(null, tasksWithoutListCountData[0].tasksCount);
    }

    return tasksCountMap;
  }

  async getUserSettingsListIds(userOrUserId: string | User): Promise<string[]> {
    const user =
      typeof userOrUserId === 'string'
        ? await usersManager.findOneById(userOrUserId)
        : userOrUserId;
    if (!user) {
      return [];
    }

    const userSettings = usersManager.getUserSettings(user);

    return userSettings.calendarVisibleListIds ?? [];
  }

  async getVisibleListIdsByUserId(userId: string): Promise<string[]> {
    const userListIds = await this.getUserSettingsListIds(userId);
    const idsSet = new Set<string>();

    // Lists
    const rows = await this.findMany({
      columns: {
        id: true,
      },
      where: eq(lists.userId, userId),
    });

    for (const row of rows) {
      idsSet.add(row.id);
    }

    // Check
    if (!userListIds.includes('*')) {
      const finalIds = new Set(userListIds);

      for (const id of idsSet) {
        if (finalIds.has(id)) {
          continue;
        }

        idsSet.delete(id);
      }
    }

    return Array.from(idsSet);
  }

  async addVisibleListIdByUserId(userId: string, listId: string) {
    const user = await usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = usersManager.getUserSettings(user);
    const userListIds = await this.getVisibleListIdsByUserId(userId);
    if (userListIds.includes(listId)) {
      return user;
    }

    userListIds.push(listId);

    return usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleListIds: userListIds,
      },
    });
  }

  async removeVisibleListIdByUserId(userId: string, listId: string) {
    const user = await usersManager.findOneById(userId);
    if (!user) {
      return;
    }

    const userSettings = usersManager.getUserSettings(user);
    const userListIds = await this.getVisibleListIdsByUserId(userId);
    if (!userListIds.includes(listId)) {
      return user;
    }

    const index = userListIds.indexOf(listId);
    if (index > -1) {
      userListIds.splice(index, 1);
    }

    return usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleListIds: userListIds,
      },
    });
  }
}

export const listsManager = new ListsManager();

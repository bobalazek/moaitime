import { and, asc, count, DBQueryConfig, desc, eq, inArray, isNull, or, SQL } from 'drizzle-orm';

import { getDatabase, List, lists, NewList, tasks, User } from '@moaitime/database-core';
import { globalEventNotifier } from '@moaitime/global-event-notifier';
import { CreateList, GlobalEventsEnum, UpdateList } from '@moaitime/shared-common';

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
      orderBy: [desc(lists.teamId), desc(lists.order), asc(lists.createdAt)],
    });

    return result;
  }

  async findOneById(id: string): Promise<List | null> {
    const row = await getDatabase().query.lists.findFirst({
      where: eq(lists.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(listId: string | null, userId: string): Promise<List | null> {
    let where = and(listId ? eq(lists.id, listId) : isNull(lists.id), isNull(lists.deletedAt));

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
      where: eq(lists.id, listId),
    });

    if (!row) {
      return false;
    }

    if (row.userId === userId) {
      return true;
    }

    const teamIds = await usersManager.getTeamIds(userId);
    if (row.teamId && teamIds.includes(row.teamId)) {
      return true;
    }

    return false;
  }

  async userCanUpdate(userId: string, listId: string): Promise<boolean> {
    return this.userCanView(userId, listId);
  }

  async userCanDelete(userId: string, listId: string): Promise<boolean> {
    return this.userCanUpdate(userId, listId);
  }

  // API Helpers
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
    await this._checkIfReachedLimit(data, user);

    const list = await this.insertOne({ ...data, userId: user.id });

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_LIST_ADDED, {
      userId: user.id,
      listId: list.id,
      teamId: list.teamId ?? undefined,
    });

    return list;
  }

  async update(userId: string, listId: string, data: UpdateList) {
    const canUpdate = await this.userCanUpdate(userId, listId);
    if (!canUpdate) {
      throw new Error('You cannot update this list');
    }

    const list = await this.updateOneById(listId, data);

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_LIST_EDITED, {
      userId,
      listId: list.id,
      teamId: list.teamId ?? undefined,
    });

    return list;
  }

  async delete(userId: string, listId: string) {
    const canDelete = await this.userCanDelete(userId, listId);
    if (!canDelete) {
      throw new Error('You cannot delete this list');
    }

    const list = await this.updateOneById(listId, {
      deletedAt: new Date(),
    });

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_LIST_DELETED, {
      userId,
      listId: list.id,
      teamId: list.teamId ?? undefined,
    });

    return list;
  }

  async addVisible(userId: string, listId: string) {
    const canView = await this.userCanView(userId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    const list = await this.addVisibleListIdByUserId(userId, listId);

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_LIST_ADD_VISIBLE, {
      userId,
      listId,
      teamId: list?.teamId ?? undefined,
    });
  }

  async removeVisible(userId: string, listId: string) {
    const canView = await this.userCanView(userId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    const list = await this.removeVisibleListIdByUserId(userId, listId);

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_LIST_REMOVE_VISIBLE, {
      userId,
      listId,
      teamId: list?.teamId ?? undefined,
    });
  }

  // Helpers
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
    const useSettingsListIds = await this.getUserSettingsListIds(userId);
    const idsSet = new Set<string>();

    // User Lists
    const userLists = await this.findMany({
      columns: {
        id: true,
      },
      where: eq(lists.userId, userId),
    });

    for (const row of userLists) {
      idsSet.add(row.id);
    }

    // Team Lists
    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length > 0) {
      const teamLists = await this.findMany({
        columns: {
          id: true,
        },
        where: inArray(lists.teamId, teamIds),
      });

      for (const row of teamLists) {
        idsSet.add(row.id);
      }
    }

    // Check
    if (!useSettingsListIds.includes('*')) {
      const finalIds = new Set(useSettingsListIds);

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
      return null;
    }

    const list = this.findOneById(listId);

    const userSettings = usersManager.getUserSettings(user);
    const userListIds = await this.getVisibleListIdsByUserId(userId);
    if (userListIds.includes(listId)) {
      return list;
    }

    userListIds.push(listId);

    await usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleListIds: userListIds,
      },
    });

    return list;
  }

  async removeVisibleListIdByUserId(userId: string, listId: string) {
    const user = await usersManager.findOneById(userId);
    if (!user) {
      return null;
    }

    const list = this.findOneById(listId);

    const userSettings = usersManager.getUserSettings(user);
    const userListIds = await this.getVisibleListIdsByUserId(userId);
    if (!userListIds.includes(listId)) {
      return list;
    }

    const index = userListIds.indexOf(listId);
    if (index > -1) {
      userListIds.splice(index, 1);
    }

    await usersManager.updateOneById(userId, {
      settings: {
        ...userSettings,
        calendarVisibleListIds: userListIds,
      },
    });

    return list;
  }

  // Private
  private async _checkIfReachedLimit(data: CreateList, user: User) {
    let maxCount = 0;
    let currentCount = 0;

    if (data.teamId) {
      const teamIds = await usersManager.getTeamIds(user.id);
      if (!teamIds.includes(data.teamId)) {
        throw new Error('You cannot create a list for this team');
      }

      const team = await teamsManager.findOneById(data.teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      maxCount = await teamsManager.getTeamLimit(team, 'listsMaxPerTeamCount');
      currentCount = await this.countByTeamId(team.id);
    } else {
      maxCount = await usersManager.getUserLimit(user, 'listsMaxPerUserCount');
      currentCount = await this.countByUserId(user.id);
    }

    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of lists per user (${maxCount}).`);
    }
  }
}

export const listsManager = new ListsManager();

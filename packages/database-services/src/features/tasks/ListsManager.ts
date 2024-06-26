import { and, asc, count, desc, eq, inArray, isNotNull, isNull, or, SQL } from 'drizzle-orm';

import { getDatabase, List, lists, NewList, tasks, taskUsers, User } from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { CreateList, GlobalEventsEnum, UpdateList } from '@moaitime/shared-common';

import { teamsManager } from '../auth/TeamsManager';
import { teamUsageManager } from '../auth/TeamUsageManager';
import { usersManager } from '../auth/UsersManager';
import { userUsageManager } from '../auth/UserUsageManager';

export type ListsManagerTaskCountOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
};

export class ListsManager {
  // API Helpers
  async list(actorUserId: string) {
    return this.findManyByUserId(actorUserId);
  }

  async listDeleted(actorUserId: string) {
    const lists = await this.findManyDeletedByUserId(actorUserId);

    return lists;
  }

  async view(actorUserId: string, listId: string) {
    const canView = await this.userCanView(actorUserId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    const data = await this.findOneByIdAndUserId(listId, actorUserId);
    if (!data) {
      throw new Error('List not found');
    }

    return data;
  }

  async create(actorUser: User, data: CreateList) {
    await this._checkIfLimitReached(actorUser, data.teamId);

    const list = await this.insertOne({ ...data, userId: actorUser.id });

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_LIST_ADDED, {
      actorUserId: actorUser.id,
      listId: list.id,
      teamId: list.teamId ?? undefined,
    });

    return list;
  }

  async update(actorUserId: string, listId: string, data: UpdateList) {
    const canUpdate = await this.userCanUpdate(actorUserId, listId);
    if (!canUpdate) {
      throw new Error('You cannot update this list');
    }

    const list = await this.updateOneById(listId, data);

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_LIST_EDITED, {
      actorUserId,
      listId: list.id,
      teamId: list.teamId ?? undefined,
    });

    return list;
  }

  async delete(actorUserId: string, listId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(actorUserId, listId);
    if (!canDelete) {
      throw new Error('You cannot delete this list');
    }

    const list = isHardDelete
      ? await this.deleteOneById(listId)
      : await this.updateOneById(listId, {
          deletedAt: new Date(),
        });

    if (!isHardDelete) {
      const result = await getDatabase()
        .select({
          id: tasks.id,
        })
        .from(tasks)
        .where(eq(tasks.listId, listId))
        .execute();
      const taskIds = result.map((item) => item.id);
      if (taskIds.length > 0) {
        await getDatabase().delete(taskUsers).where(inArray(taskUsers.taskId, taskIds)).execute();
      }

      await this.updateOneById(listId, {
        teamId: null,
      });
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_LIST_DELETED, {
      actorUserId,
      listId: list.id,
      teamId: list.teamId ?? undefined,
      isHardDelete,
    });

    return list;
  }

  async undelete(actorUser: User, listId: string) {
    const canDelete = await this.userCanUpdate(actorUser.id, listId);
    if (!canDelete) {
      throw new Error('You cannot undelete this list');
    }

    await this._checkIfLimitReached(actorUser);

    const list = await this.updateOneById(listId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_LIST_UNDELETED, {
      actorUserId: actorUser.id,
      listId: list.id,
      teamId: list.teamId ?? undefined,
    });

    return list;
  }

  async addVisible(actorUserId: string, listId: string) {
    const canView = await this.userCanView(actorUserId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    const list = await this.addVisibleListIdByUserId(actorUserId, listId);

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_LIST_ADD_VISIBLE, {
      actorUserId,
      listId,
      teamId: list?.teamId ?? undefined,
    });

    return list;
  }

  async removeVisible(actorUserId: string, listId: string) {
    const canView = await this.userCanView(actorUserId, listId);
    if (!canView) {
      throw new Error('You cannot view this list');
    }

    const list = await this.removeVisibleListIdByUserId(actorUserId, listId);

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_LIST_REMOVE_VISIBLE, {
      actorUserId,
      listId,
      teamId: list?.teamId ?? undefined,
    });

    return list;
  }

  // Permissions
  async userCanView(userId: string, listId: string): Promise<boolean> {
    if (listId === '') {
      // This is the unlisted list - everybody can view it
      return true;
    }

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

  // Helpers
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

  async findManyDeletedByUserId(userId: string): Promise<List[]> {
    return getDatabase().query.lists.findMany({
      where: and(eq(lists.userId, userId), isNotNull(lists.deletedAt)),
      orderBy: desc(lists.createdAt),
    });
  }

  async findOneById(listId: string): Promise<List | null> {
    const row = await getDatabase().query.lists.findFirst({
      where: eq(lists.id, listId),
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

  async updateOneById(listId: string, data: Partial<NewList>): Promise<List> {
    const rows = await getDatabase()
      .update(lists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lists.id, listId))
      .returning();

    return rows[0];
  }

  async deleteOneById(listId: string): Promise<List> {
    const rows = await getDatabase().delete(lists).where(eq(lists.id, listId)).returning();

    return rows[0];
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

    if (listIds.length === 0) {
      return tasksCountMap;
    }

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
    const userLists = await getDatabase().query.lists.findMany({
      columns: {
        id: true,
      },
      where: eq(lists.userId, userId),
    });

    idsSet.add(''); // Unlisted

    for (const row of userLists) {
      idsSet.add(row.id);
    }

    // Team Lists
    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length > 0) {
      const teamLists = await getDatabase().query.lists.findMany({
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

    // Allow for unlisted ("" - empty string)
    const list = listId ? this.findOneById(listId) : null;

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

    // Allow for unlisted ("" - empty string)
    const list = listId ? this.findOneById(listId) : null;

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
  private async _checkIfLimitReached(actorUser: User, teamId?: string | null) {
    let maxCount = 0;
    let currentCount = 0;

    if (teamId) {
      const teamIds = await usersManager.getTeamIds(actorUser.id);
      if (!teamIds.includes(teamId)) {
        throw new Error('You cannot create a list for this team');
      }

      const team = await teamsManager.findOneById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      maxCount = await teamUsageManager.getTeamLimit(team, 'listsMaxPerTeamCount');
      currentCount = await this.countByTeamId(team.id);
    } else {
      maxCount = await userUsageManager.getUserLimit(actorUser, 'listsMaxPerUserCount');
      currentCount = await this.countByUserId(actorUser.id);
    }

    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of lists per user (${maxCount}).`);
    }
  }
}

export const listsManager = new ListsManager();

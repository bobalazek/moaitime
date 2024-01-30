import { and, asc, count, DBQueryConfig, desc, eq, isNull, SQL } from 'drizzle-orm';

import { getDatabase, List, lists, NewList, tasks, User } from '@moaitime/database-core';

import { usersManager } from '../auth/UsersManager';

export type ListsManagerFindManyByUserIdTaskCountOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
};

export class ListsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<List[]> {
    return getDatabase().query.lists.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<List[]> {
    const result = await getDatabase().query.lists.findMany({
      where: and(eq(lists.userId, userId), isNull(lists.deletedAt)),
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

  async findOneByIdAndUserId(id: string, userId: string): Promise<List | null> {
    const row = await getDatabase().query.lists.findFirst({
      where: and(eq(lists.id, id), eq(lists.userId, userId)),
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

    return row !== null;
  }

  async userCanUpdate(userId: string, listId: string): Promise<boolean> {
    return this.userCanView(userId, listId);
  }

  async userCanDelete(userId: string, listId: string): Promise<boolean> {
    return this.userCanUpdate(userId, listId);
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(lists.id).mapWith(Number),
      })
      .from(lists)
      .where(and(eq(lists.userId, userId), isNull(lists.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async getTasksCountMap(userId: string, options?: ListsManagerFindManyByUserIdTaskCountOptions) {
    const tasksCountMap = new Map<string | null, number>();
    let where = eq(tasks.userId, userId);

    if (!options?.includeCompleted) {
      where = and(where, isNull(tasks.completedAt)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(tasks.deletedAt)) as SQL<unknown>;
    }

    const tasksCountData = await getDatabase()
      .select({ listId: tasks.listId, tasksCount: count(tasks.id).mapWith(Number) })
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(where)
      .groupBy(tasks.listId)
      .execute();
    for (const item of tasksCountData) {
      tasksCountMap.set(item.listId, item.tasksCount);
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

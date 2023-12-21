import { and, asc, count, DBQueryConfig, desc, eq, inArray, isNull, SQL } from 'drizzle-orm';

import { getDatabase, List, lists, NewList, tasks } from '@moaitime/database-core';

export type ListsManagerFindManyByUserIdOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
};

export class ListsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<List[]> {
    return getDatabase().query.lists.findMany(options);
  }

  async findManyByUserId(
    userId: string,
    options?: ListsManagerFindManyByUserIdOptions
  ): Promise<List[]> {
    const result = await getDatabase().query.lists.findMany({
      where: and(eq(lists.userId, userId), isNull(lists.deletedAt)),
      orderBy: [desc(lists.order), asc(lists.createdAt)],
    });
    const ids = result.map((list) => list.id);
    const tasksCountMap = await this.getTasksCountMap(ids, options);

    return result.map((list) => ({
      ...list,
      tasksCount: tasksCountMap.get(list.id) ?? 0,
    }));
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

  // Helpers
  async getTasksCountMap(ids: string[], options?: ListsManagerFindManyByUserIdOptions) {
    const tasksCountMap = new Map<string, number>();
    if (ids.length > 0) {
      let where = inArray(tasks.listId, ids);

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
    }

    return tasksCountMap;
  }

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
}

export const listsManager = new ListsManager();

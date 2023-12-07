import { and, count, DBQueryConfig, eq, inArray, isNull } from 'drizzle-orm';

import {
  databaseClient,
  insertListSchema,
  List,
  lists,
  NewList,
  tasks,
  updateListSchema,
} from '@myzenbuddy/database-core';

export class ListsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<List[]> {
    return databaseClient.query.lists.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<List[]> {
    const result = await databaseClient.query.lists.findMany({
      where: and(eq(lists.userId, userId), isNull(lists.deletedAt)),
    });
    const ids = result.map((list) => list.id);

    // TODO: do it all in one query

    const tasksCountData =
      ids.length > 0
        ? await databaseClient
            .select({ listId: tasks.listId, tasksCount: count(tasks.id).mapWith(Number) })
            .from(tasks)
            .leftJoin(lists, eq(tasks.listId, lists.id))
            .where(inArray(tasks.listId, ids))
            .groupBy(tasks.listId)
            .execute()
        : [];
    const tasksCountMap = new Map(tasksCountData.map((item) => [item.listId, item.tasksCount]));

    return result.map((list) => ({
      ...list,
      tasksCount: tasksCountMap.get(list.id) ?? 0,
    }));
  }

  async findOneById(id: string): Promise<List | null> {
    const row = await databaseClient.query.lists.findFirst({
      where: eq(lists.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<List | null> {
    const row = await databaseClient.query.lists.findFirst({
      where: and(eq(lists.id, id), eq(lists.userId, userId)),
    });

    return row ?? null;
  }

  async insertOne(data: NewList): Promise<List> {
    data = insertListSchema.parse(data) as unknown as List;

    const rows = await databaseClient.insert(lists).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewList>): Promise<List> {
    data = updateListSchema.parse(data) as unknown as NewList;

    const rows = await databaseClient
      .update(lists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lists.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<List> {
    const rows = await databaseClient.delete(lists).where(eq(lists.id, id)).returning();

    return rows[0];
  }
}

export const listsManager = new ListsManager();

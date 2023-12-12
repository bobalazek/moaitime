import { and, asc, DBQueryConfig, desc, eq, isNull, SQL } from 'drizzle-orm';

import { getDatabase, lists, NewTask, Task, tasks } from '@myzenbuddy/database-core';
import { SortDirectionEnum } from '@myzenbuddy/shared-common';

export type TasksManagerFindManyByListIdOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
  sortField?: keyof Task;
  sortDirection?: SortDirectionEnum;
};

export class TasksManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Task[]> {
    return getDatabase().query.tasks.findMany(options);
  }

  async findManyByListId(
    listId: string,
    options?: TasksManagerFindManyByListIdOptions
  ): Promise<Task[]> {
    let where: SQL<unknown> = eq(tasks.listId, listId);
    let orderBy: SQL<unknown> = asc(tasks.createdAt);

    if (!options?.includeCompleted) {
      where = and(where, isNull(tasks.completedAt)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(tasks.deletedAt)) as SQL<unknown>;
    }

    if (options?.sortField) {
      const direction = options?.sortDirection ?? SortDirectionEnum.ASC;
      const field = tasks[options.sortField] ?? tasks.order;

      orderBy = direction === SortDirectionEnum.ASC ? asc(field) : desc(field);
    }

    return getDatabase().query.tasks.findMany({
      where,
      orderBy,
    });
  }

  async findOneById(id: string): Promise<Task | null> {
    const row = await getDatabase().query.tasks.findFirst({
      where: eq(lists.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<Task | null> {
    const rows = await getDatabase()
      .select()
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(and(eq(tasks.id, id), eq(lists.userId, userId)))
      .execute();

    return rows?.[0].tasks ?? null;
  }

  async findMaxOrderByListId(listId: string): Promise<number> {
    const rows = await getDatabase()
      .select()
      .from(tasks)
      .where(eq(tasks.listId, listId))
      .orderBy(desc(tasks.order))
      .limit(1)
      .execute();

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].order;
  }

  async insertOne(data: NewTask): Promise<Task> {
    const rows = await getDatabase().insert(tasks).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewTask>): Promise<Task> {
    const rows = await getDatabase()
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    return rows[0];
  }

  async updateReorder(map: { [key: string]: number }) {
    return getDatabase().transaction(async (tx) => {
      for (const taskId in map) {
        await tx.update(tasks).set({ order: map[taskId] }).where(eq(tasks.id, taskId));
      }
    });
  }

  async deleteOneById(id: string): Promise<Task> {
    const rows = await getDatabase().delete(tasks).where(eq(tasks.id, id)).returning();

    return rows[0];
  }
}

export const tasksManager = new TasksManager();

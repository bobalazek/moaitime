import { and, asc, DBQueryConfig, desc, eq, isNull, SQL } from 'drizzle-orm';

import {
  databaseClient,
  insertTaskSchema,
  lists,
  NewTask,
  Task,
  tasks,
  updateTaskSchema,
} from '@myzenbuddy/database-core';
import { SortDirectionEnum } from '@myzenbuddy/shared-common';

export type TaskManagerFindManyByListIdOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
  sortField?: keyof Task;
  sortDirection?: SortDirectionEnum;
};

export class TasksManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Task[]> {
    return databaseClient.query.tasks.findMany(options);
  }

  async findManyByListId(
    listId: string,
    options?: TaskManagerFindManyByListIdOptions
  ): Promise<Task[]> {
    let where: SQL<unknown> = eq(tasks.listId, listId);
    let orderBy: SQL<unknown> | undefined = undefined;

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

    return databaseClient.query.tasks.findMany({
      where,
      orderBy,
    });
  }

  async findOneById(id: string): Promise<Task | null> {
    const row = await databaseClient.query.tasks.findFirst({
      where: eq(lists.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<Task | null> {
    const rows = await databaseClient
      .select()
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(and(eq(tasks.id, id), eq(lists.userId, userId)))
      .execute();

    return rows?.[0].tasks ?? null;
  }

  async findMaxOrderByListId(listId: string): Promise<number> {
    const row = await databaseClient
      .select()
      .from(tasks)
      .where(eq(tasks.listId, listId))
      .orderBy(desc(tasks.order))
      .limit(1)
      .execute();

    return row?.[0]?.order ?? 0;
  }

  async insertOne(data: NewTask): Promise<Task> {
    data = insertTaskSchema.parse(data) as unknown as Task;

    const rows = await databaseClient.insert(tasks).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewTask>): Promise<Task> {
    data = updateTaskSchema.parse(data) as unknown as NewTask;

    const rows = await databaseClient
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    return rows[0];
  }

  async updateReorder(map: { [key: string]: number }) {
    return databaseClient.transaction(async (tx) => {
      for (const taskId in map) {
        await tx.update(tasks).set({ order: map[taskId] }).where(eq(tasks.id, taskId));
      }
    });
  }

  async deleteOneById(id: string): Promise<Task> {
    const rows = await databaseClient.delete(tasks).where(eq(tasks.id, id)).returning();

    return rows[0];
  }
}

export const tasksManager = new TasksManager();
import { format } from 'date-fns';
import {
  and,
  asc,
  between,
  count,
  DBQueryConfig,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
  SQL,
} from 'drizzle-orm';

import {
  getDatabase,
  lists,
  NewTask,
  Tag,
  tags,
  Task,
  tasks,
  taskTags,
} from '@moaitime/database-core';
import { SortDirectionEnum, TasksListSortFieldEnum } from '@moaitime/shared-common';

export type TasksManagerFindManyByListIdOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
  sortField?: keyof Task;
  sortDirection?: SortDirectionEnum;
};

export class TasksManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Task[]> {
    const rows = await getDatabase().query.tasks.findMany(options);

    return rows.map((row) => {
      return this._fixRowColumns(row);
    });
  }

  async findManyByListId(
    listId: string | null,
    options?: TasksManagerFindManyByListIdOptions
  ): Promise<Task[]> {
    let where = listId ? eq(tasks.listId, listId) : isNull(tasks.listId);
    const orderBy: Array<SQL<unknown>> = [asc(tasks.createdAt)];

    if (!options?.includeCompleted) {
      where = and(where, isNull(tasks.completedAt)) as SQL<unknown>;
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(tasks.deletedAt)) as SQL<unknown>;
    }

    if (options?.sortField) {
      const direction = options?.sortDirection ?? SortDirectionEnum.ASC;
      const field = tasks[options.sortField] ?? tasks.order;

      orderBy.unshift(direction === SortDirectionEnum.ASC ? asc(field) : desc(field));
    }

    if (options?.sortField === TasksListSortFieldEnum.ORDER) {
      orderBy.unshift(asc(tasks.priority));
    }

    const rootWhere = and(where, isNull(tasks.parentId)) as SQL<unknown>;
    const rows = await getDatabase().query.tasks.findMany({
      where: rootWhere,
      orderBy,
    });

    const childrenWhere = and(where, isNotNull(tasks.parentId)) as SQL<unknown>;
    const children = await getDatabase().query.tasks.findMany({
      where: childrenWhere,
      orderBy,
    });
    const childrenMap: { [key: string]: Task[] } = {};
    for (const child of children) {
      if (!child.parentId) {
        continue;
      }

      if (!childrenMap[child.parentId]) {
        childrenMap[child.parentId] = [];
      }

      childrenMap[child.parentId].push(child);
    }

    return rows.map((row) => {
      const task = this._fixRowColumns(row);

      return {
        ...task,
        children: childrenMap[task.id] ?? [],
      };
    });
  }

  async findManyByQueryAndUserId(
    query: string,
    userId: string,
    limit: number = 10
  ): Promise<Task[]> {
    const where = and(
      eq(tasks.userId, userId),
      isNull(tasks.deletedAt),
      isNull(lists.deletedAt),
      or(ilike(tasks.name, `%${query}%`), ilike(tasks.description, `%${query}%`))
    );

    const rows = await getDatabase()
      .select()
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(where)
      .limit(limit)
      .execute();

    return rows.map((row) => {
      const task = this._fixRowColumns(row.tasks);
      const list = row.lists;

      return { ...task, list };
    });
  }

  async findManyByListIdsAndRange(
    listIds: string[],
    from?: Date,
    to?: Date
  ): Promise<(Task & { listColor: string | null })[]> {
    if (listIds.length === 0) {
      return [];
    }

    let where = and(inArray(lists.id, listIds), isNull(tasks.deletedAt), isNotNull(tasks.dueDate));

    if (from && to) {
      where = and(
        where,
        between(tasks.dueDate, from.toISOString(), to.toISOString())
      ) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(tasks.dueDate, from.toISOString())) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(tasks.dueDate, to.toISOString())) as SQL<unknown>;
    }

    const rows = await getDatabase()
      .select()
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(where)
      .execute();

    if (rows.length === 0) {
      return [];
    }

    return rows.map((row) => {
      const task = this._fixRowColumns(row.tasks);
      return { ...task, listColor: row.lists?.color ?? null };
    });
  }

  async findManyByParentId(parentId: string): Promise<Task[]> {
    const rows = await getDatabase()
      .select()
      .from(tasks)
      .where(and(eq(tasks.parentId, parentId), isNull(tasks.deletedAt)))
      .orderBy(asc(tasks.order))
      .execute();

    return rows.map((row) => this._fixRowColumns(row));
  }

  async findOneById(id: string): Promise<Task | null> {
    const row = await getDatabase().query.tasks.findFirst({
      where: eq(lists.id, id),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByIdAndUserId(taskId: string, userId: string): Promise<Task | null> {
    const rows = await getDatabase()
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .execute();

    if (rows.length === 0) {
      return null;
    }

    return this._fixRowColumns(rows[0]);
  }

  async findMaxOrderByListId(listId: string | null): Promise<number> {
    const where = listId ? eq(tasks.listId, listId) : isNull(tasks.listId);

    const rows = await getDatabase()
      .select()
      .from(tasks)
      .where(where)
      .orderBy(desc(tasks.order))
      .limit(1)
      .execute();

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].order ?? 0;
  }

  async insertOne(data: NewTask): Promise<Task> {
    const rows = await getDatabase().insert(tasks).values(data).returning();

    return this._fixRowColumns(rows[0]);
  }

  async updateOneById(id: string, data: Partial<NewTask>): Promise<Task> {
    const rows = await getDatabase()
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    return this._fixRowColumns(rows[0]);
  }

  async deleteOneById(id: string): Promise<Task> {
    const rows = await getDatabase().delete(tasks).where(eq(tasks.id, id)).returning();

    // We may want to optimize this at some point

    const children = await this.findManyByParentId(id);
    for (const child of children) {
      await this.deleteOneById(child.id);
    }

    return this._fixRowColumns(rows[0]);
  }

  // Helpers
  async userCanView(userId: string, taskId: string): Promise<boolean> {
    const rows = await getDatabase()
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .execute();

    return rows.length > 0;
  }

  async userCanUpdate(userId: string, taskId: string): Promise<boolean> {
    return this.userCanView(userId, taskId);
  }

  async userCanDelete(userId: string, taskId: string): Promise<boolean> {
    return this.userCanUpdate(userId, taskId);
  }

  async updateReorder(map: { [key: string]: number }) {
    return getDatabase().transaction(async (tx) => {
      for (const taskId in map) {
        await tx.update(tasks).set({ order: map[taskId] }).where(eq(tasks.id, taskId));
      }
    });
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(tasks.id).mapWith(Number),
      })
      .from(tasks)
      .where(and(eq(tasks.userId, userId), isNull(tasks.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async countByListId(listId: string | null): Promise<number> {
    const where = listId ? eq(tasks.listId, listId) : isNull(tasks.listId);

    const result = await getDatabase()
      .select({
        count: count(tasks.id).mapWith(Number),
      })
      .from(tasks)
      .where(and(where, isNull(tasks.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async duplicate(id: string): Promise<Task> {
    const task = await this.findOneById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const duplicatedTask = await this.insertOne({
      ...task,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      name: `${task.name} (copy)`,
    });

    await this.reorder(task.listId, SortDirectionEnum.ASC, task.id, duplicatedTask.id);

    return this._fixRowColumns(duplicatedTask);
  }

  async reorder(
    listId: string | null,
    sortDirection: SortDirectionEnum,
    originalTaskId: string,
    newTaskId: string
  ) {
    const result = await tasksManager.findManyByListId(listId, {
      includeCompleted: true,
      includeDeleted: true,
      sortField: 'order',
      sortDirection: sortDirection,
    });

    const originalIndex = result.findIndex((task) => task.id === originalTaskId);
    const newIndex = result.findIndex((task) => task.id === newTaskId);

    const [movedTask] = result.splice(originalIndex, 1);
    result.splice(newIndex, 0, movedTask);

    const reorderMap: { [key: string]: number } = {};
    if (sortDirection === SortDirectionEnum.ASC) {
      result.forEach((task, index) => {
        reorderMap[task.id] = index;
      });
    } else {
      result.forEach((task, index) => {
        reorderMap[task.id] = result.length - 1 - index;
      });
    }

    await tasksManager.updateReorder(reorderMap);
  }

  /**
   * @param id if null, we are creating a new task
   * @param parentId
   */
  async validateParentId(id: string | null, parentId: string) {
    const task = id ? await this.findOneById(id) : null;
    if (id && !task) {
      throw new Error('Task not found');
    }

    const parentTask = await this.findOneById(parentId);
    if (!parentTask) {
      throw new Error('Parent task not found');
    }

    if (id && task) {
      if (parentId === task.id) {
        throw new Error('Task cannot be its own parent');
      }

      if (parentTask.parentId === task.id) {
        throw new Error('Parent task cannot be a child of this task');
      }

      const depth = await this.getDepth(parentId);
      if (depth > 1) {
        throw new Error('Task cannot be moved any deeper');
      }

      const children = await this.findManyByParentId(id);
      if (children.length > 0) {
        throw new Error('Task with child tasks cannot have a parent');
      }
    }
  }

  async getDepth(taskId: string): Promise<number> {
    const task = await this.findOneById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    let depth = 0;
    let parent = task.parentId;
    while (parent) {
      depth++;
      const parentTask = await this.findOneById(parent);
      if (!parentTask) {
        break;
      }

      parent = parentTask.parentId;
    }

    return depth;
  }

  async setTags(taskId: string, tagIds: string[]) {
    const currentTaskTags = await getDatabase()
      .select()
      .from(taskTags)
      .where(eq(taskTags.taskId, taskId))
      .execute();

    const currentTagIds = currentTaskTags.map((row) => row.tagId);

    const toDelete = currentTagIds.filter((tagId) => !tagIds.includes(tagId));
    const toInsert = tagIds.filter((tagId) => !currentTagIds.includes(tagId));

    if (toDelete.length) {
      await getDatabase()
        .delete(taskTags)
        .where(and(eq(taskTags.taskId, taskId), inArray(taskTags.tagId, toDelete)))
        .execute();
    }

    if (toInsert.length) {
      await getDatabase()
        .insert(taskTags)
        .values(
          toInsert.map((tagId) => ({
            taskId,
            tagId,
          }))
        )
        .execute();
    }
  }

  async getTagIdsForTaskIds(taskIds: string[]): Promise<Record<string, Tag[]>> {
    if (taskIds.length === 0) {
      return {};
    }

    const rows = await getDatabase()
      .select()
      .from(taskTags)
      .where(and(inArray(taskTags.taskId, taskIds), isNull(tags.deletedAt)))
      .leftJoin(tags, eq(taskTags.tagId, tags.id))
      .execute();

    const map: Record<string, Tag[]> = {};
    for (const row of rows) {
      if (!row.tags) {
        continue;
      }

      const { taskId } = row.task_tags;
      if (!map[taskId]) {
        map[taskId] = [];
      }

      map[taskId].push(row.tags);
    }

    return map;
  }

  async getCountsByListIdsAndYear(listIds: string[], year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    if (listIds.length === 0) {
      return [];
    }

    const dueDate = sql<Date>`DATE(${tasks.dueDate})`;
    const where = and(
      inArray(lists.id, listIds),
      isNull(lists.deletedAt),
      isNull(tasks.deletedAt),
      isNotNull(tasks.dueDate),
      between(dueDate, startOfYear, endOfYear)
    );

    const result = await getDatabase()
      .select({
        count: count(tasks.id).mapWith(Number),
        date: dueDate,
      })
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(where)
      .groupBy(dueDate)
      .execute();

    return result.map((row) => {
      return {
        date: format(row.date, 'yyyy-MM-dd'),
        count: row.count,
      };
    });
  }

  // Private
  private _fixRowColumns(task: Task) {
    // TODO
    // Bug in drizzle: https://github.com/drizzle-team/drizzle-orm/issues/1185.
    // Should actually be a string
    if (task.dueDate && (task.dueDate as unknown as Date) instanceof Date) {
      task.dueDate = format(task.dueDate as unknown as Date, 'yyyy-MM-dd');
    }

    // We do not want the seconds here
    if (task.dueDateTime && task.dueDateTime.length === 8) {
      task.dueDateTime = task.dueDateTime.slice(0, -3);
    }

    return task;
  }
}

export const tasksManager = new TasksManager();

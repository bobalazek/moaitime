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
  List,
  lists,
  NewTask,
  Tag,
  tags,
  Task,
  tasks,
  taskTags,
  User,
} from '@moaitime/database-core';
import { globalEventNotifier } from '@moaitime/global-event-notifier';
import {
  CreateTask,
  GlobalEventsEnum,
  SortDirectionEnum,
  TasksListSortFieldEnum,
  UpdateTask,
} from '@moaitime/shared-common';

import { teamsManager } from '../auth/TeamsManager';
import { usersManager } from '../auth/UsersManager';
import { listsManager } from './ListsManager';
import { tagsManager } from './TagsManager';

export type TaskManagerListOptions = {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
  includeList?: boolean;
  sortField?: keyof Task;
  sortDirection?: SortDirectionEnum;
  excludeChildren?: boolean;
  limit?: number;
  query?: string;
};

export class TasksManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Task[]> {
    const rows = await getDatabase().query.tasks.findMany(options);

    return rows.map((row) => {
      return this._fixRowColumns(row);
    });
  }

  async findManyByUserId(
    userId: string,
    listId: string | null,
    options?: TaskManagerListOptions
  ): Promise<Task[]> {
    let where = listId ? eq(tasks.listId, listId) : isNull(tasks.listId);
    const orderBy: Array<SQL<unknown>> = [asc(tasks.createdAt)];

    // The null/unlisted list is an exception, so we always want to get the items as they are only from the user
    if (!listId) {
      where = and(where, eq(tasks.userId, userId)) as SQL<unknown>;
    } else {
      const list = await listsManager.findOneByIdAndUserId(listId, userId);
      if (!list) {
        throw new Error('List for task not found');
      }
    }

    if (options?.query) {
      where = and(
        where,
        or(ilike(tasks.name, `%${options.query}%`), ilike(tasks.description, `%${options.query}%`))
      ) as SQL<unknown>;
    }

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

    const childrenMap = {} as Record<string, Task[]>;

    const rootWhere = and(where, isNull(tasks.parentId)) as SQL<unknown>;

    const query = getDatabase()
      .select()
      .from(tasks)
      .leftJoin(lists, eq(tasks.listId, lists.id))
      .where(rootWhere)
      .orderBy(...orderBy);
    if (options?.limit) {
      query.limit(options.limit);
    }

    const rows = await query.execute();

    if (!options?.excludeChildren) {
      const childrenWhere = and(where, isNotNull(tasks.parentId)) as SQL<unknown>;
      const children = await getDatabase().query.tasks.findMany({
        where: childrenWhere,
        orderBy,
      });

      for (const child of children) {
        if (!child.parentId) {
          continue;
        }

        if (!childrenMap[child.parentId]) {
          childrenMap[child.parentId] = [];
        }

        childrenMap[child.parentId].push(child);
      }
    }

    return rows.map((row) => {
      const task = this._fixRowColumns(row.tasks);
      const list = options?.includeList ? row.lists : undefined;

      return {
        ...task,
        list,
        children: childrenMap[task.id] ?? [],
      };
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
      where: eq(tasks.id, id),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByIdAndUserId(
    taskId: string,
    userId: string
  ): Promise<(Task & { list: List | null }) | null> {
    const rows = await getDatabase()
      .select()
      .from(tasks)
      .leftJoin(lists, eq(lists.id, tasks.listId))
      .where(eq(tasks.id, taskId))
      .execute();
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    if (row.lists?.teamId) {
      const teamIds = await usersManager.getTeamIds(userId);
      if (!teamIds.includes(row.lists.teamId)) {
        return null;
      }
    } else if (row.tasks.userId !== userId) {
      return null;
    }

    const task = this._fixRowColumns(row.tasks);

    return {
      ...task,
      list: row.lists,
    };
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

  // Permissions
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

  // API Helpers
  async list(userId: string, listId: string, options: TaskManagerListOptions) {
    const { query, includeCompleted, includeDeleted, sortField, sortDirection } = options;

    const includeList = !!query; // the only place for now where we need the list is the search
    const limit = !query ? undefined : 10; // Same as above

    const tasks = await this.findManyByUserId(userId, listId, {
      includeCompleted,
      includeDeleted,
      includeList,
      sortField,
      sortDirection,
      query,
      limit,
    });

    return this._populateTags(tasks);
  }

  async reorder(
    userId: string,
    listId: string | null,
    data: {
      sortDirection: SortDirectionEnum;
      listId: string | null;
      originalTaskId: string;
      newTaskId: string;
    }
  ) {
    const { sortDirection, listId: newListId, originalTaskId, newTaskId } = data;

    const list = listsManager.findOneByIdAndUserId(listId, userId);
    if (!list) {
      throw new Error('List not found');
    }

    await this.reorderList(newListId, userId, sortDirection, originalTaskId, newTaskId);

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_REORDERED, {
      userId,
      listId: listId ?? undefined,
    });
  }

  async view(userId: string, taskId: string) {
    const row = await this.findOneByIdAndUserId(taskId, userId);
    if (!row) {
      throw new Error('Task not found');
    }

    return (await this._populateTags([row]))[0];
  }

  async create(user: User, data: CreateTask) {
    let list: List | null = null;
    if (data.listId) {
      list = await listsManager.findOneByIdAndUserId(data.listId, user.id);
      if (!list) {
        throw new Error('List not found');
      }
    }

    await this._doMaxTasksPerListCheck(user, list);

    if (data.parentId) {
      await this.validateParentId(null, data.parentId);
    }

    const { tagIds, ...insertData } = data;

    const maxOrderForListId = await this.findMaxOrderByListId(insertData?.listId ?? null);
    const order = maxOrderForListId + 1;

    const task = await this.insertOne({ ...insertData, order, userId: user.id });

    if (Array.isArray(tagIds)) {
      await this.setTags(task, tagIds);
    }

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_ADDED, {
      userId: user.id,
      taskId: task.id,
      listId: task.listId ?? undefined,
      teamId: list?.teamId ?? undefined,
    });

    return task;
  }

  async update(user: User, taskId: string, data: UpdateTask) {
    const task = await this.findOneByIdAndUserId(taskId, user.id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.deletedAt) {
      throw new Error('You can not update a deleted task');
    }

    let list: List | null = null;
    if (data.listId) {
      list = await listsManager.findOneByIdAndUserId(data.listId, user.id);
      if (!list) {
        throw new Error('List not found');
      }

      await this._doMaxTasksPerListCheck(user, list);
    }

    if (data.parentId) {
      await this.validateParentId(taskId, data.parentId);
    }

    const { tagIds, ...updateData } = data;

    const updatedData = await this.updateOneById(taskId, updateData);

    if (Array.isArray(tagIds)) {
      await this.setTags(task, tagIds);
    }

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_EDITED, {
      userId: user.id,
      taskId: task.id,
      listId: task.listId ?? undefined,
      teamId: list?.teamId ?? task.list?.teamId ?? undefined,
    });

    return updatedData;
  }

  async delete(userId: string, taskId: string, isHardDelete?: boolean) {
    const task = await this.findOneByIdAndUserId(taskId, userId);
    if (!task) {
      throw new Error('Task not found');
    }

    const data = isHardDelete
      ? await this.deleteOneById(taskId)
      : await this.updateOneById(taskId, {
          deletedAt: new Date(),
        });

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_DELETED, {
      userId,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
      isHardDelete: isHardDelete,
    });

    return data;
  }

  async undelete(user: User, taskId: string) {
    const task = await this.findOneByIdAndUserId(taskId, user.id);
    if (!task) {
      throw new Error('Task not found');
    }

    // We want to make that if if we undelete a task, we don't go over the limit
    const list = task.listId ? await listsManager.findOneByIdAndUserId(task.listId, user.id) : null;
    const { tasksCount, tasksMaxPerListCount } = await this._doMaxTasksPerListCheck(
      user,
      list,
      true
    );
    // That +1 would be the newly undeleted task
    if (tasksCount + 1 > tasksMaxPerListCount) {
      throw new Error(
        `You would reach the maximum number of tasks per list (${tasksMaxPerListCount}) with this undelete.`
      );
    }

    const updatedData = await this.updateOneById(taskId, {
      deletedAt: null,
    });

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_UNDELETED, {
      userId: user.id,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
    });

    return updatedData;
  }

  async duplicate(userId: string, taskId: string) {
    const task = await this.duplicateTask(userId, taskId);

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_DUPLICATED, {
      userId,
      taskId,
      listId: task?.listId ?? undefined,
      teamId: task?.list?.teamId ?? undefined,
    });

    return task;
  }

  async complete(userId: string, taskId: string) {
    const task = await this.findOneByIdAndUserId(taskId, userId);
    if (!task) {
      throw new Error('Task not found');
    }

    const data = await this.updateOneById(taskId, {
      completedAt: new Date(),
    });

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_COMPLETED, {
      userId,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
    });

    return data;
  }

  async uncomplete(userId: string, taskId: string) {
    const task = await this.findOneByIdAndUserId(taskId, userId);
    if (!task) {
      throw new Error('Task not found');
    }

    const data = this.updateOneById(taskId, {
      completedAt: null,
    });

    globalEventNotifier.publish(GlobalEventsEnum.TASKS_TASK_UNCOMPLETED, {
      userId,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
    });

    return data;
  }

  // Helpers
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

  async countByListId(listId: string | null, userId: string): Promise<number> {
    let where = listId ? eq(tasks.listId, listId) : isNull(tasks.listId);
    if (!listId) {
      where = and(where, eq(tasks.userId, userId)) as SQL<unknown>;
    }

    const result = await getDatabase()
      .select({
        count: count(tasks.id).mapWith(Number),
      })
      .from(tasks)
      .where(and(where, isNull(tasks.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async duplicateTask(userId: string, taskId: string) {
    const task = await this.findOneByIdAndUserId(taskId, userId);
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

    await this.reorderList(task.listId, userId, SortDirectionEnum.ASC, task.id, duplicatedTask.id);

    const newTask = await this.findOneByIdAndUserId(duplicatedTask.id, userId);
    if (!newTask) {
      throw new Error('Duplicated task not found');
    }

    return newTask;
  }

  async reorderList(
    listId: string | null,
    userId: string,
    sortDirection: SortDirectionEnum,
    originalTaskId: string,
    newTaskId: string
  ) {
    const result = await this.findManyByUserId(userId, listId, {
      includeCompleted: true,
      includeDeleted: true,
      sortField: 'order',
      sortDirection,
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

    await this.updateReorder(reorderMap);
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

  async setTags(task: Task, tagIds: string[]) {
    const newTags = await tagsManager.findMany({
      where: inArray(tags.id, tagIds),
    });
    const list = task.listId ? await listsManager.findOneById(task.listId) : null;

    // Check that we do not assign tags from different teams
    let teamId: string | null = null;
    if (list?.teamId) {
      const teamIds = await usersManager.getTeamIds(task.userId);
      if (!teamIds.includes(list.teamId)) {
        throw new Error('You cannot assign a tag from this team');
      }

      teamId = list.teamId;
    }

    for (const tag of newTags) {
      if (teamId === tag.teamId) {
        continue;
      }

      throw new Error(`You cannot assign a tag (${tag.name}) from a user or from different teams`);
    }

    const currentTaskTags = await getDatabase()
      .select()
      .from(taskTags)
      .where(eq(taskTags.taskId, task.id))
      .execute();

    const currentTagIds = currentTaskTags.map((row) => row.tagId);

    const toDelete = currentTagIds.filter((tagId) => !tagIds.includes(tagId));
    const toInsert = tagIds.filter((tagId) => !currentTagIds.includes(tagId));

    if (toDelete.length) {
      await getDatabase()
        .delete(taskTags)
        .where(and(eq(taskTags.taskId, task.id), inArray(taskTags.tagId, toDelete)))
        .execute();
    }

    if (toInsert.length) {
      await getDatabase()
        .insert(taskTags)
        .values(
          toInsert.map((tagId) => ({
            taskId: task.id,
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

  private async _populateTags(tasks: Task[]) {
    const taskIds = tasks.map((task) => task.id);
    const tagsMap = await this.getTagIdsForTaskIds(taskIds);

    return tasks.map((task) => {
      const tags = tagsMap[task.id] || [];
      const tagIds = tags.map((tag) => tag.id);

      return {
        ...task,
        tags,
        tagIds,
      };
    });
  }

  private async _doMaxTasksPerListCheck(user: User, list: List | null, skipError?: boolean) {
    let tasksMaxPerListCount = 0;

    if (list && list.teamId) {
      const team = await teamsManager.findOneById(list.teamId);
      tasksMaxPerListCount = team
        ? await teamsManager.getTeamLimit(team, 'tasksMaxPerListCount')
        : 0;
    } else {
      tasksMaxPerListCount = await usersManager.getUserLimit(user, 'tasksMaxPerListCount');
    }

    const tasksCount = await this.countByListId(list?.id ?? null, user.id);
    if (!skipError && tasksCount >= tasksMaxPerListCount) {
      throw new Error(
        `You have reached the maximum number of tasks per list (${tasksMaxPerListCount}).`
      );
    }

    return {
      tasksMaxPerListCount,
      tasksCount,
    };
  }
}

export const tasksManager = new TasksManager();

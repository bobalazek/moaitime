import { addDays, addMilliseconds, format } from 'date-fns';
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
  taskUsers,
  User,
  users,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { logger } from '@moaitime/logging';
import {
  CreateTask,
  getRuleFromString,
  getRuleIterationAfter,
  GlobalEventsEnum,
  SortDirectionEnum,
  TasksListSortFieldEnum,
  UpdateTask,
} from '@moaitime/shared-common';

import { teamsManager } from '../auth/TeamsManager';
import { usersManager } from '../auth/UsersManager';
import { listsManager } from './ListsManager';
import { tagsManager } from './TagsManager';

export type TaskWithListColor = Task & { listColor?: string | null };

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

        childrenMap[child.parentId].push(this._fixRowColumns(child));
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
  ): Promise<TaskWithListColor[]> {
    if (listIds.length === 0) {
      return [];
    }

    const includesUnlisted = listIds.includes('');
    const finalListIds = includesUnlisted ? listIds.filter((id) => id !== '') : listIds;

    let where = and(isNull(tasks.deletedAt), isNotNull(tasks.dueDate));

    if (finalListIds.length === 0 && !includesUnlisted) {
      return [];
    }

    where = and(
      where,
      includesUnlisted
        ? or(inArray(lists.id, finalListIds), isNull(lists.id))
        : inArray(lists.id, finalListIds)
    ) as SQL<unknown>;

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

  async updateOneById(taskId: string, data: Partial<NewTask>): Promise<Task> {
    const rows = await getDatabase()
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();

    return this._fixRowColumns(rows[0]);
  }

  async deleteOneById(taskId: string): Promise<Task> {
    const rows = await getDatabase().delete(tasks).where(eq(tasks.id, taskId)).returning();

    // We may want to optimize this at some point

    const children = await this.findManyByParentId(taskId);
    for (const child of children) {
      await this.deleteOneById(child.id);
    }

    return this._fixRowColumns(rows[0]);
  }

  // Permissions
  async userCanView(userId: string, taskId: string): Promise<boolean> {
    const task = await this.findOneById(taskId);
    if (!task) {
      return false;
    }

    if (task.userId === userId) {
      return true;
    }

    // When we are at this point and there would not be a listId set, then there is probably a bug somewhere,
    // because the only way the listId is null is for a single user, which should alreadbe be caught few lines above.
    // So this is more a Typescript sanity check
    return task.listId ? listsManager.userCanView(userId, task.listId) : false;
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

    return this.populateTagsAndUsers(tasks);
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

    const list = await listsManager.findOneByIdAndUserId(listId, userId);
    if (!list) {
      throw new Error('List not found');
    }

    await this.reorderList(newListId, userId, sortDirection, originalTaskId, newTaskId);

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_REORDERED, {
      actorUserId: userId,
      listId: listId ?? undefined,
      teamId: list?.teamId ?? undefined,
    });
  }

  async view(userId: string, taskId: string) {
    const row = await this.findOneByIdAndUserId(taskId, userId);
    if (!row) {
      throw new Error('Task not found');
    }

    const tasks = await this.populateTagsAndUsers([row]);

    return tasks[0];
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

    const { tagIds, userIds, ...insertData } = data;

    const teamId = list?.teamId ?? undefined;

    const maxOrderForListId = await this.findMaxOrderByListId(insertData?.listId ?? null);
    const order = maxOrderForListId + 1;
    const dueDateRepeatEndsAt = insertData.dueDateRepeatEndsAt
      ? new Date(insertData.dueDateRepeatEndsAt)
      : null;

    const task = await this.insertOne({
      ...insertData,
      order,
      dueDateRepeatEndsAt,
      userId: user.id,
    });

    if (Array.isArray(tagIds)) {
      await this.setTags(task, tagIds);
    }

    if (Array.isArray(userIds)) {
      if (!list?.teamId && userIds.length > 0) {
        throw new Error('You cannot assign users to non-team list');
      }

      await this.setUsers(task, userIds, user, teamId);
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_ADDED, {
      actorUserId: user.id,
      taskId: task.id,
      listId: task.listId ?? undefined,
      teamId,
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

    let children: Task[] = [];
    let childrenUpdateData: Partial<NewTask> = {};

    let list: List | null = null;
    if (typeof data.listId !== 'undefined') {
      list = await listsManager.findOneByIdAndUserId(data.listId, user.id);

      const { tasksMaxPerListCount, tasksCount } = await this._doMaxTasksPerListCheck(user, list);

      const currentList = task.listId
        ? await listsManager.findOneByIdAndUserId(task.listId, user.id)
        : null;
      if (currentList?.teamId && !list) {
        throw new Error('You cannot change the list to a non-team list');
      }

      if (list && currentList && list.teamId !== currentList.teamId) {
        throw new Error('You cannot change the list to a list from a different team');
      }

      if (task.parentId) {
        throw new Error('You cannot change the list of a task that is assigned to a parent task');
      }

      children = await this.findManyByParentId(taskId);
      const childrenCount = children.length;
      if (tasksCount + childrenCount >= tasksMaxPerListCount) {
        throw new Error(
          `This task has ${childrenCount} child tasks and you would reach the maximum number of tasks per list (${tasksMaxPerListCount}) with this update.`
        );
      }

      childrenUpdateData = {
        listId: data.listId,
      };
    }

    if (data.parentId) {
      await this.validateParentId(taskId, data.parentId);
    }

    const { tagIds, userIds, ...updateData } = data;

    const teamId = list?.teamId ?? task.list?.teamId ?? undefined;

    let dueDateRepeatEndsAt = undefined;
    if (updateData.dueDateRepeatEndsAt === null) {
      dueDateRepeatEndsAt = null;
    } else if (typeof updateData.dueDateRepeatEndsAt === 'string') {
      dueDateRepeatEndsAt = new Date(updateData.dueDateRepeatEndsAt);
    }

    let completedAt: Date | null | undefined = undefined;
    if (
      typeof updateData.dueDate !== 'undefined' &&
      typeof updateData.dueDateTime !== 'undefined' &&
      typeof updateData.dueDateTimeZone !== 'undefined' &&
      (task.dueDate !== updateData.dueDate ||
        task.dueDateTime !== updateData.dueDateTime ||
        task.dueDateTimeZone !== updateData.dueDateTimeZone) &&
      task.completedAt
    ) {
      completedAt = null;
    }

    const updatedTask = await this.updateOneById(taskId, {
      ...updateData,
      dueDateRepeatEndsAt,
      completedAt,
    });

    if (
      children.length > 0 &&
      typeof childrenUpdateData === 'object' &&
      Object.keys(childrenUpdateData).length > 0
    ) {
      for (const child of children) {
        await this.updateOneById(child.id, childrenUpdateData);
      }
    }

    if (Array.isArray(tagIds)) {
      await this.setTags(task, tagIds);
    }

    if (Array.isArray(userIds)) {
      if (!list?.teamId && userIds.length > 0) {
        throw new Error('You cannot assign users to non-team list');
      }

      await this.setUsers(task, userIds, user, teamId);
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_EDITED, {
      actorUserId: user.id,
      taskId: updatedTask.id,
      listId: updatedTask.listId ?? undefined,
      teamId,
    });

    return updatedTask;
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

    const children = await this.findManyByParentId(taskId);
    if (children.length > 0) {
      for (const child of children) {
        await this.delete(userId, child.id, isHardDelete);
      }
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_DELETED, {
      actorUserId: userId,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
      isHardDelete,
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

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_UNDELETED, {
      actorUserId: user.id,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
    });

    return updatedData;
  }

  async duplicate(userId: string, taskId: string) {
    const task = await this.duplicateTask(userId, taskId);

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_DUPLICATED, {
      actorUserId: userId,
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

    let data = task as Task;

    if (task.dueDateRepeatPattern) {
      try {
        if (!task.dueDate) {
          throw new Error(`[TasksManager] Due date was not set with date repeat pattern`);
        }

        const currentDueDate = new Date(
          task.dueDateTime
            ? `${task.dueDate}T${task.dueDateTime}`
            : addDays(new Date(task.dueDate), 1)
        );
        const rule = getRuleFromString(task.dueDateRepeatPattern);

        const nextExecutionDate = getRuleIterationAfter(rule, addMilliseconds(currentDueDate, 1));
        if (nextExecutionDate) {
          const dueDate = nextExecutionDate.toISOString().slice(0, 10);
          const dueDateTime = task.dueDateTime
            ? nextExecutionDate.toISOString().split('T')?.[1].slice(0, 8)
            : undefined;

          data = await this.updateOneById(taskId, {
            dueDate,
            dueDateTime,
          });
        } else {
          // No more executions left, so we just set it to completed
          data = await this.updateOneById(taskId, {
            completedAt: new Date(),
          });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

        logger.warn(
          `[TasksManager] There was an error trying to update the new due date pattern: ${errorMessage}`
        );

        // In case something goes wrong here, just set the task to unchecked by default
        data = await this.updateOneById(taskId, {
          completedAt: new Date(),
        });
      }
    } else {
      data = await this.updateOneById(taskId, {
        completedAt: new Date(),
      });
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_COMPLETED, {
      actorUserId: userId,
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

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_UNCOMPLETED, {
      actorUserId: userId,
      taskId,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
    });

    return data;
  }

  async nudge(userId: string, taskId: string, userIds: string[]) {
    const task = await this.findOneByIdAndUserId(taskId, userId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (userIds.length === 0) {
      throw new Error('You need to provide at least one user to nudge');
    }

    if (userIds.includes(userId)) {
      throw new Error('You cannot nudge yourself');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_NUDGED, {
      actorUserId: userId,
      taskId,
      userIds,
      listId: task.listId ?? undefined,
      teamId: task.list?.teamId ?? undefined,
    });

    return task;
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
  async validateParentId(taskId: string | null, parentId: string) {
    const task = taskId ? await this.findOneById(taskId) : null;
    if (taskId && !task) {
      throw new Error('Task not found');
    }

    const parentTask = await this.findOneById(parentId);
    if (!parentTask) {
      throw new Error('Parent task not found');
    }

    if (taskId && task) {
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

      const children = await this.findManyByParentId(taskId);
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
    const newTags =
      tagIds.length > 0
        ? await tagsManager.findMany({
            where: inArray(tags.id, tagIds),
          })
        : [];
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

  async setUsers(task: Task, userIds: string[], assigningUser: User, teamId?: string) {
    const currentTaskUsers = await getDatabase()
      .select()
      .from(taskUsers)
      .where(eq(taskUsers.taskId, task.id))
      .execute();

    const currentUserId = currentTaskUsers.map((row) => row.userId);

    const toDelete = currentUserId.filter((userId) => !userIds.includes(userId));
    const toInsert = userIds.filter((userId) => !currentUserId.includes(userId));

    if (toDelete.length) {
      await getDatabase()
        .delete(taskUsers)
        .where(and(eq(taskUsers.taskId, task.id), inArray(taskUsers.userId, toDelete)))
        .execute();
    }

    if (toInsert.length) {
      await getDatabase()
        .insert(taskUsers)
        .values(
          toInsert.map((userId) => ({
            taskId: task.id,
            userId,
          }))
        )
        .execute();

      for (const userId of toInsert) {
        globalEventsNotifier.publish(GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER, {
          actorUserId: assigningUser.id,
          userId,
          taskId: task.id,
          teamId,
        });
      }
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

  async getUserIdsForTaskIds(taskIds: string[]): Promise<Record<string, User[]>> {
    if (taskIds.length === 0) {
      return {};
    }

    const rows = await getDatabase()
      .select()
      .from(taskUsers)
      .where(inArray(taskUsers.taskId, taskIds))
      .leftJoin(users, eq(taskUsers.userId, users.id))
      .execute();

    const map: Record<string, User[]> = {};
    for (const row of rows) {
      if (!row.users) {
        continue;
      }

      const { taskId } = row.task_users;
      if (!map[taskId]) {
        map[taskId] = [];
      }

      map[taskId].push(row.users);
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

  async populateTagsAndUsers(tasks: TaskWithListColor[]) {
    const taskIds = tasks.map((task) => task.id);
    const tagsMap = await this.getTagIdsForTaskIds(taskIds);
    const usersMap = await this.getUserIdsForTaskIds(taskIds);

    return tasks.map((task) => {
      const tags = tagsMap[task.id] || [];
      const tagIds = tags.map((tag) => tag.id);
      const users = usersMap[task.id] || [];
      const userIds = users.map((user) => user.id);

      return {
        ...task,
        tags,
        tagIds,
        users,
        userIds,
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

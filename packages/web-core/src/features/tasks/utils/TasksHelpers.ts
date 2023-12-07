import {
  API_URL,
  ListInterface,
  ResponseInterface,
  SortDirectionEnum,
  TaskInterface,
} from '@myzenbuddy/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export type OmitedList = Omit<ListInterface, 'id' | 'order' | 'createdAt' | 'updatedAt'>;
export type OmitedTask = Omit<TaskInterface, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

/********** Database **********/
const _databaseTasks: TaskInterface[] = [];

/********** Lists **********/
export const loadLists = async () => {
  const response = await fetchJson<ResponseInterface<ListInterface[]>>(`${API_URL}/api/v1/lists`, {
    method: 'GET',
  });

  return response;
};

export const getList = async (listId: string): Promise<ListInterface> => {
  const response = await fetchJson<ResponseInterface<ListInterface>>(
    `${API_URL}/api/v1/lists/${listId}`,
    {
      method: 'GET',
    }
  );

  return response.data as ListInterface;
};

export const addList = async (list: OmitedList): Promise<ListInterface> => {
  const response = await fetchJson<ResponseInterface<ListInterface>>(`${API_URL}/api/v1/lists`, {
    method: 'POST',
    body: JSON.stringify(list),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as ListInterface;
};

export const editList = async (
  listId: string,
  list: Partial<ListInterface>
): Promise<ListInterface> => {
  const response = await fetchJson<ResponseInterface<ListInterface>>(
    `${API_URL}/api/v1/lists/${listId}`,
    {
      method: 'PUT',
      body: JSON.stringify(list),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as ListInterface;
};

export const deleteList = async (listId: string): Promise<ListInterface | null> => {
  const response = await fetchJson<ResponseInterface<ListInterface>>(
    `${API_URL}/api/v1/lists/${listId}`,
    {
      method: 'DELETE',
    }
  );

  return response.data as ListInterface;
};

/********** Tasks **********/
export const getTasksForList = async (
  listId?: string,
  options?: {
    includeCompleted?: boolean;
    includeDeleted?: boolean;
    sortField?: string;
    sortDirection?: SortDirectionEnum;
  }
): Promise<TaskInterface[]> => {
  const includeCompleted = options?.includeCompleted ?? true;
  const includeDeleted = options?.includeDeleted ?? false;
  const sortField = options?.sortField ?? 'createdAt';
  const sortDirection = options?.sortDirection ?? SortDirectionEnum.ASC;

  let finalTasks = _databaseTasks.filter((task) => task.listId === listId);

  if (!includeCompleted) {
    finalTasks = finalTasks.filter((task) => !task.completedAt);
  }

  if (!includeDeleted) {
    finalTasks = finalTasks.filter((task) => !task.deletedAt);
  }

  finalTasks = finalTasks.sort((a, b) => {
    const field = sortField as keyof TaskInterface;
    const aValue = a[field]?.toString() ?? undefined;
    const bValue = b[field]?.toLocaleString() ?? undefined;

    if (typeof aValue !== 'undefined' && typeof bValue !== 'undefined') {
      if (sortField.endsWith('At')) {
        return sortDirection === SortDirectionEnum.ASC
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return sortDirection === SortDirectionEnum.ASC
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return finalTasks;
};

export const getTask = async (taskId: string): Promise<TaskInterface | null> => {
  return _databaseTasks.find((task) => task.id === taskId) ?? null;
};

export const addTask = async (task: OmitedTask): Promise<TaskInterface> => {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  const order = (await getTasksForList(task.listId)).length;
  const addedTask: TaskInterface = {
    ...task,
    id,
    order,
    createdAt,
    updatedAt: createdAt,
  };

  _databaseTasks.push(addedTask);

  return addedTask;
};

export const editTask = async (
  taskId: string,
  task: Partial<TaskInterface>
): Promise<TaskInterface> => {
  const taskIndex = _databaseTasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  const editedTask = {
    ..._databaseTasks[taskIndex],
    ...task,
    updatedAt: new Date().toISOString(),
  };

  _databaseTasks[taskIndex] = editedTask;

  return editedTask;
};

export const deleteTask = async (taskId: string): Promise<TaskInterface> => {
  return editTask(taskId, {
    deletedAt: new Date().toISOString(),
  });
};

export const reorderTask = async (
  originalTaskId: string,
  newTaskId: string,
  sortDirection: SortDirectionEnum
): Promise<TaskInterface[]> => {
  const originalTask = await getTask(originalTaskId);
  if (!originalTask) {
    throw new Error('Original task not found');
  }

  const newTask = await getTask(newTaskId);
  if (!newTask) {
    throw new Error('New task not found');
  }

  const tasks = await getTasksForList(originalTask.listId, {
    sortDirection,
    sortField: 'order',
  });

  const originalIndex = tasks.findIndex((task) => task.id === originalTaskId);
  const newIndex = tasks.findIndex((task) => task.id === newTaskId);

  const [movedTask] = tasks.splice(originalIndex, 1);
  tasks.splice(newIndex, 0, movedTask);

  if (sortDirection === SortDirectionEnum.ASC) {
    tasks.forEach((task, index) => {
      task.order = index;
    });
  } else {
    tasks.forEach((task, index) => {
      task.order = tasks.length - 1 - index;
    });
  }

  await Promise.all(tasks.map((task) => editTask(task.id, { order: task.order })));

  return tasks;
};

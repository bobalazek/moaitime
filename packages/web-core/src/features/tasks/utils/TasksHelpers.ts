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

/********** Lists **********/
export const loadLists = async () => {
  const response = await fetchJson<ResponseInterface<ListInterface[]>>(`${API_URL}/api/v1/lists`, {
    method: 'GET',
  });

  return response.data as ListInterface[];
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
  const url = `${API_URL}/api/v1/tasks?listId=${listId}&includeCompleted=${
    includeCompleted ? 'true' : 'false'
  }&includeDeleted=${
    includeDeleted ? 'true' : 'false'
  }&sortField=${sortField}&sortDirection=${sortDirection}`;

  const response = await fetchJson<ResponseInterface<TaskInterface[]>>(url, {
    method: 'GET',
  });

  return response.data as TaskInterface[];
};

export const getTask = async (taskId: string): Promise<TaskInterface | null> => {
  const response = await fetchJson<ResponseInterface<ListInterface>>(
    `${API_URL}/api/v1/tasks/${taskId}`,
    {
      method: 'GET',
    }
  );

  return response.data as TaskInterface;
};

export const addTask = async (task: OmitedTask): Promise<TaskInterface> => {
  const response = await fetchJson<ResponseInterface<TaskInterface>>(`${API_URL}/api/v1/tasks`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as TaskInterface;
};

export const editTask = async (
  taskId: string,
  task: Partial<TaskInterface>
): Promise<TaskInterface> => {
  const response = await fetchJson<ResponseInterface<TaskInterface>>(
    `${API_URL}/api/v1/tasks/${taskId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(task),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as TaskInterface;
};

export const deleteTask = async (taskId: string): Promise<TaskInterface> => {
  const response = await fetchJson<ResponseInterface<TaskInterface>>(
    `${API_URL}/api/v1/tasks/${taskId}`,
    {
      method: 'DELETE',
    }
  );

  return response.data as TaskInterface;
};

export const undeleteTask = async (taskId: string): Promise<TaskInterface> => {
  const response = await fetchJson<ResponseInterface<TaskInterface>>(
    `${API_URL}/api/v1/tasks/${taskId}/undelete`,
    {
      method: 'POST',
    }
  );

  return response.data as TaskInterface;
};

export const completeTask = async (taskId: string): Promise<TaskInterface> => {
  const response = await fetchJson<ResponseInterface<TaskInterface>>(
    `${API_URL}/api/v1/tasks/${taskId}/complete`,
    {
      method: 'POST',
    }
  );

  return response.data as TaskInterface;
};

export const uncompleteTask = async (taskId: string): Promise<TaskInterface> => {
  const response = await fetchJson<ResponseInterface<TaskInterface>>(
    `${API_URL}/api/v1/tasks/${taskId}/uncomplete`,
    {
      method: 'POST',
    }
  );

  return response.data as TaskInterface;
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

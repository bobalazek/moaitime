import {
  API_URL,
  List,
  ResponseInterface,
  SortDirectionEnum,
  Task,
} from '@myzenbuddy/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Lists **********/
export const loadLists = async (options?: {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
}) => {
  const includeCompleted = options?.includeCompleted ?? false;
  const includeDeleted = options?.includeDeleted ?? false;
  const url = `${API_URL}/api/v1/lists?includeCompleted=${
    includeCompleted ? 'true' : 'false'
  }&includeDeleted=${includeDeleted ? 'true' : 'false'}`;

  const response = await fetchJson<ResponseInterface<List[]>>(url, {
    method: 'GET',
  });

  return response.data as List[];
};

export const getList = async (listId: string): Promise<List> => {
  const response = await fetchJson<ResponseInterface<List>>(`${API_URL}/api/v1/lists/${listId}`, {
    method: 'GET',
  });

  return response.data as List;
};

export const addList = async (list: List): Promise<List> => {
  const response = await fetchJson<ResponseInterface<List>>(`${API_URL}/api/v1/lists`, {
    method: 'POST',
    body: JSON.stringify(list),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as List;
};

export const editList = async (listId: string, list: Partial<List>): Promise<List> => {
  const response = await fetchJson<ResponseInterface<List>>(`${API_URL}/api/v1/lists/${listId}`, {
    method: 'PUT',
    body: JSON.stringify(list),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as List;
};

export const deleteList = async (listId: string): Promise<List | null> => {
  const response = await fetchJson<ResponseInterface<List>>(`${API_URL}/api/v1/lists/${listId}`, {
    method: 'DELETE',
  });

  return response.data as List;
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
): Promise<Task[]> => {
  const includeCompleted = options?.includeCompleted ?? true;
  const includeDeleted = options?.includeDeleted ?? false;
  const sortField = options?.sortField ?? 'createdAt';
  const sortDirection = options?.sortDirection ?? SortDirectionEnum.ASC;
  const url = `${API_URL}/api/v1/tasks?listId=${listId}&includeCompleted=${
    includeCompleted ? 'true' : 'false'
  }&includeDeleted=${
    includeDeleted ? 'true' : 'false'
  }&sortField=${sortField}&sortDirection=${sortDirection}`;

  const response = await fetchJson<ResponseInterface<Task[]>>(url, {
    method: 'GET',
  });

  return response.data as Task[];
};

export const getTask = async (taskId: string): Promise<Task | null> => {
  const response = await fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks/${taskId}`, {
    method: 'GET',
  });

  return response.data as Task;
};

export const addTask = async (task: Task): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Task;
};

export const editTask = async (taskId: string, task: Partial<Task>): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(task),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Task;
};

export const deleteTask = async (taskId: string): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
  });

  return response.data as Task;
};

export const undeleteTask = async (taskId: string): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(
    `${API_URL}/api/v1/tasks/${taskId}/undelete`,
    {
      method: 'POST',
    }
  );

  return response.data as Task;
};

export const completeTask = async (taskId: string): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(
    `${API_URL}/api/v1/tasks/${taskId}/complete`,
    {
      method: 'POST',
    }
  );

  return response.data as Task;
};

export const uncompleteTask = async (taskId: string): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(
    `${API_URL}/api/v1/tasks/${taskId}/uncomplete`,
    {
      method: 'POST',
    }
  );

  return response.data as Task;
};

export const reorderTask = async (
  listId: string,
  originalTaskId: string,
  newTaskId: string,
  sortDirection: SortDirectionEnum
) => {
  return fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks/reorder`, {
    method: 'POST',
    body: JSON.stringify({ listId, originalTaskId, newTaskId, sortDirection }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

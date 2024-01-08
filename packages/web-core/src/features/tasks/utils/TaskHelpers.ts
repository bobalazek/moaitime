import {
  API_URL,
  CreateTask,
  ResponseInterface,
  SortDirectionEnum,
  Task,
  UpdateTask,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Tasks **********/
export const getTask = async (taskId: string): Promise<Task | null> => {
  const response = await fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks/${taskId}`, {
    method: 'GET',
  });

  return response.data as Task;
};

export const addTask = async (task: CreateTask): Promise<Task> => {
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

export const editTask = async (taskId: string, task: UpdateTask): Promise<Task> => {
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

export const deleteTask = async (taskId: string, isHardDelete?: boolean): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(`${API_URL}/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
    body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
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

export const duplicateTask = async (taskId: string): Promise<Task> => {
  const response = await fetchJson<ResponseInterface<Task>>(
    `${API_URL}/api/v1/tasks/${taskId}/duplicate`,
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

/********** Misc **********/
export function setCursorToEnd(element: HTMLElement) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection?.removeAllRanges();
  selection?.addRange(range);
}
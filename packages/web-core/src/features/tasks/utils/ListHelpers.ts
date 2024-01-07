import {
  API_URL,
  CreateList,
  List,
  ResponseInterface,
  SortDirectionEnum,
  Task,
  TasksListSortFieldEnum,
  UpdateList,
} from '@moaitime/shared-common';

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

  return response.data ?? [];
};

export const getList = async (listId: string): Promise<List> => {
  const response = await fetchJson<ResponseInterface<List>>(`${API_URL}/api/v1/lists/${listId}`, {
    method: 'GET',
  });

  return response.data as List;
};

export const addList = async (list: CreateList): Promise<List> => {
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

export const editList = async (listId: string, list: UpdateList): Promise<List> => {
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

export const addVisibleList = async (listId: string): Promise<List> => {
  const response = await fetchJson<ResponseInterface<List>>(
    `${API_URL}/api/v1/lists/${listId}/add-visible`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as List;
};

export const removeVisibleList = async (listId: string): Promise<List> => {
  const response = await fetchJson<ResponseInterface<List>>(
    `${API_URL}/api/v1/lists/${listId}/remove-visible`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as List;
};

export const getTasksForList = async (
  listId?: string,
  options?: {
    includeCompleted?: boolean;
    includeDeleted?: boolean;
    sortField?: TasksListSortFieldEnum;
    sortDirection?: SortDirectionEnum;
  }
): Promise<Task[]> => {
  const includeCompleted = options?.includeCompleted ?? true;
  const includeDeleted = options?.includeDeleted ?? false;
  const sortField = options?.sortField ?? TasksListSortFieldEnum.CREATED_AT;
  const sortDirection = options?.sortDirection ?? SortDirectionEnum.ASC;
  const url = `${API_URL}/api/v1/tasks?listId=${listId}&includeCompleted=${
    includeCompleted ? 'true' : 'false'
  }&includeDeleted=${
    includeDeleted ? 'true' : 'false'
  }&sortField=${sortField}&sortDirection=${sortDirection}`;

  const response = await fetchJson<ResponseInterface<Task[]>>(url, {
    method: 'GET',
  });

  return response.data ?? [];
};

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
export const getLists = async (options?: {
  includeCompleted?: boolean;
  includeDeleted?: boolean;
}) => {
  const url = new URL(`${API_URL}/api/v1/lists`);

  if (options?.includeCompleted) {
    url.searchParams.set('includeCompleted', 'true');
  }

  if (options?.includeDeleted) {
    url.searchParams.set('includeDeleted', 'true');
  }

  const response = await fetchJson<ResponseInterface<List[]>>(url.toString(), {
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
    `${API_URL}/api/v1/lists/${listId}/visible`,
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
    `${API_URL}/api/v1/lists/${listId}/visible`,
    {
      method: 'DELETE',
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

  const url = new URL(`${API_URL}/api/v1/tasks`);

  if (listId) {
    url.searchParams.set('listId', listId);
  }

  if (includeCompleted) {
    url.searchParams.set('includeCompleted', 'true');
  }

  if (includeDeleted) {
    url.searchParams.set('includeDeleted', 'true');
  }

  url.searchParams.set('sortField', sortField);
  url.searchParams.set('sortDirection', sortDirection);

  const response = await fetchJson<ResponseInterface<Task[]>>(url, {
    method: 'GET',
  });

  return response.data ?? [];
};

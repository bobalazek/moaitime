import {
  CreateGoal,
  Goal,
  GoalsListSortFieldEnum,
  ResponseInterface,
  SortDirectionEnum,
  UpdateGoal,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Goals **********/
export const getGoals = async (options?: {
  search?: string;
  sortField?: GoalsListSortFieldEnum;
  sortDirection?: SortDirectionEnum;
  includeDeleted?: boolean;
}): Promise<Goal[]> => {
  const search = options?.search ?? '';
  const sortField = options?.sortField ?? GoalsListSortFieldEnum.CREATED_AT;
  const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;
  const includeDeleted = options?.includeDeleted ?? false;

  const url = new URL(`${API_URL}/api/v1/goals`);
  if (search) {
    url.searchParams.append('search', search);
  }

  if (sortField) {
    url.searchParams.append('sortField', sortField);
  }

  if (sortDirection) {
    url.searchParams.append('sortDirection', sortDirection);
  }

  if (includeDeleted) {
    url.searchParams.append('includeDeleted', 'true');
  }

  const response = await fetchJson<ResponseInterface<Goal[]>>(url.toString(), {
    method: 'GET',
  });

  return response.data ?? [];
};

export const getGoal = async (goalId: string): Promise<Goal> => {
  const response = await fetchJson<ResponseInterface<Goal>>(`${API_URL}/api/v1/goals/${goalId}`, {
    method: 'GET',
  });

  return response.data as Goal;
};

export const addGoal = async (goal: CreateGoal): Promise<Goal> => {
  const response = await fetchJson<ResponseInterface<Goal>>(`${API_URL}/api/v1/goals`, {
    method: 'POST',
    body: JSON.stringify(goal),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Goal;
};

export const editGoal = async (goalId: string, goal: UpdateGoal): Promise<Goal> => {
  const response = await fetchJson<ResponseInterface<Goal>>(`${API_URL}/api/v1/goals/${goalId}`, {
    method: 'PATCH',
    body: JSON.stringify(goal),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Goal;
};

export const deleteGoal = async (goalId: string, isHardDelete?: boolean): Promise<Goal> => {
  const response = await fetchJson<ResponseInterface<Goal>>(`${API_URL}/api/v1/goals/${goalId}`, {
    method: 'DELETE',
    body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Goal;
};

export const undeleteGoal = async (goalId: string): Promise<Goal> => {
  const response = await fetchJson<ResponseInterface<Goal>>(
    `${API_URL}/api/v1/goals/${goalId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Goal;
};

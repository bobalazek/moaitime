import {
  API_URL,
  CreateHabit,
  Habit,
  ResponseInterface,
  UpdateHabit,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Habits **********/
export const getHabit = async (habitId: string): Promise<Habit | null> => {
  const url = new URL(`${API_URL}/api/v1/habits/${habitId}`);

  const response = await fetchJson<ResponseInterface<Habit | null>>(url.toString(), {
    method: 'GET',
  });

  return response.data as Habit;
};

export const addHabit = async (habit: CreateHabit): Promise<Habit> => {
  const response = await fetchJson<ResponseInterface<Habit>>(`${API_URL}/api/v1/habits`, {
    method: 'POST',
    body: JSON.stringify(habit),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Habit;
};

export const editHabit = async (habitId: string, habit: UpdateHabit): Promise<Habit> => {
  const response = await fetchJson<ResponseInterface<Habit>>(
    `${API_URL}/api/v1/habits/${habitId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(habit),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Habit;
};

export const deleteHabit = async (habitId: string, isHardDelete?: boolean): Promise<Habit> => {
  const response = await fetchJson<ResponseInterface<Habit>>(
    `${API_URL}/api/v1/habits/${habitId}`,
    {
      method: 'DELETE',
      body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Habit;
};

export const undeleteHabit = async (habitId: string): Promise<Habit> => {
  const response = await fetchJson<ResponseInterface<Habit>>(
    `${API_URL}/api/v1/habits/${habitId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Habit;
};

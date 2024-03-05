import {
  API_URL,
  CreateHabit,
  Habit,
  HabitDailtEntry,
  HabitDaily,
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

export const getHabits = async (): Promise<Habit[]> => {
  const response = await fetchJson<ResponseInterface<Habit[]>>(`${API_URL}/api/v1/habits`, {
    method: 'GET',
  });

  return response.data as Habit[];
};

export const getDeletedHabits = async () => {
  const response = await fetchJson<ResponseInterface<Habit[]>>(`${API_URL}/api/v1/habits/deleted`, {
    method: 'GET',
  });

  return response.data ?? [];
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

/********** Habits Daily **********/
export const getHabitsDaily = async (date: string): Promise<HabitDaily[]> => {
  const response = await fetchJson<ResponseInterface<HabitDaily[]>>(
    `${API_URL}/api/v1/habits/daily/${date}`,
    {
      method: 'GET',
    }
  );

  return response.data as HabitDaily[];
};

export const updateHabitDaily = async (
  habitId: string,
  date: string,
  amount: number
): Promise<HabitDailtEntry> => {
  const response = await fetchJson<ResponseInterface<HabitDailtEntry>>(
    `${API_URL}/api/v1/habits/${habitId}/daily/${date}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ amount }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as HabitDailtEntry;
};

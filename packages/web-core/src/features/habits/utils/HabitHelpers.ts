import {
  CreateHabit,
  Habit,
  HabitDaily,
  HabitDailyEntry,
  HabitTemplate,
  ResponseInterface,
  UpdateHabit,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

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

export const getHabitTemplates = async (): Promise<HabitTemplate[]> => {
  const response = await fetchJson<ResponseInterface<HabitTemplate[]>>(
    `${API_URL}/api/v1/habits/templates`,
    {
      method: 'GET',
    }
  );

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

export const reorderHabits = async (originalHabitId: string, newHabitId: string) => {
  return fetchJson<ResponseInterface<Habit>>(`${API_URL}/api/v1/habits/reorder`, {
    method: 'POST',
    body: JSON.stringify({ originalHabitId, newHabitId }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
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
): Promise<HabitDailyEntry> => {
  const response = await fetchJson<ResponseInterface<HabitDailyEntry>>(
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

  return response.data as HabitDailyEntry;
};

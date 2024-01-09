import {
  API_URL,
  CreateMoodEntry,
  MoodEntry,
  ResponseInterface,
  UpdateMoodEntry,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Mood Entries **********/
export const loadMoodEntries = async (): Promise<MoodEntry[]> => {
  const url = new URL(`${API_URL}/api/v1/mood-entries`);

  const response = await fetchJson<ResponseInterface<MoodEntry[]>>(url.toString(), {
    method: 'GET',
  });

  return response.data ?? [];
};

export const getMoodEntry = async (moodEntryId: string): Promise<MoodEntry> => {
  const response = await fetchJson<ResponseInterface<MoodEntry>>(
    `${API_URL}/api/v1/mood-entries/${moodEntryId}`,
    {
      method: 'GET',
    }
  );

  return response.data as MoodEntry;
};

export const addMoodEntry = async (moodEntry: CreateMoodEntry): Promise<MoodEntry> => {
  const response = await fetchJson<ResponseInterface<MoodEntry>>(`${API_URL}/api/v1/mood-entries`, {
    method: 'POST',
    body: JSON.stringify(moodEntry),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as MoodEntry;
};

export const editMoodEntry = async (
  moodEntryId: string,
  moodEntry: UpdateMoodEntry
): Promise<MoodEntry> => {
  const response = await fetchJson<ResponseInterface<MoodEntry>>(
    `${API_URL}/api/v1/mood-entries/${moodEntryId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(moodEntry),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as MoodEntry;
};

export const deleteMoodEntry = async (
  moodEntryId: string,
  isHardDelete?: boolean
): Promise<MoodEntry> => {
  const response = await fetchJson<ResponseInterface<MoodEntry>>(
    `${API_URL}/api/v1/mood-entries/${moodEntryId}`,
    {
      method: 'DELETE',
      body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as MoodEntry;
};

export const undeleteMoodEntry = async (moodEntryId: string): Promise<MoodEntry> => {
  const response = await fetchJson<ResponseInterface<MoodEntry>>(
    `${API_URL}/api/v1/mood-entries/${moodEntryId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as MoodEntry;
};

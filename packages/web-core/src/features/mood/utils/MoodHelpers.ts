import {
  API_URL,
  CreateMoodEntry,
  MoodEntry,
  ResponseInterface,
  UpdateMoodEntry,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Mood Entries **********/
export type MoodEntriesManagerFindOptions = {
  previousCursor?: string;
  nextCursor?: string;
};

export const getMoodEntriesRawResponse = async (options?: MoodEntriesManagerFindOptions) => {
  const url = new URL(`${API_URL}/api/v1/mood-entries`);

  if (options?.previousCursor) {
    url.searchParams.append('previousCursor', options.previousCursor);
  }

  if (options?.nextCursor) {
    url.searchParams.append('nextCursor', options.nextCursor);
  }

  return fetchJson<ResponseInterface<MoodEntry[]>>(url.toString(), {
    method: 'GET',
  });
};

export const getMoodEntries = async (): Promise<MoodEntry[]> => {
  const response = await getMoodEntriesRawResponse();

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

// Audio
export const playAudioAfterNewMoodEntry = (score: number) => {
  let src;

  if (score === -2) {
    src = '/assets/mood/score_m2.mp3';
  } else if (score === -1) {
    src = '/assets/mood/score_m1.mp3';
  } else if (score === 0) {
    src = '/assets/mood/score_0.mp3';
  } else if (score === 1) {
    src = '/assets/mood/score_1.mp3';
  } else if (score === 2) {
    src = '/assets/mood/score_2.mp3';
  }

  if (!src) {
    return;
  }

  const audio = new Audio();
  audio.src = src;
  audio.play();
};

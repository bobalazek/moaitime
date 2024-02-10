import {
  API_URL,
  CreateFeedbackEntry,
  FeedbackEntry,
  ResponseInterface,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const addFeedbackEntry = async (moodEntry: CreateFeedbackEntry): Promise<FeedbackEntry> => {
  const response = await fetchJson<ResponseInterface<FeedbackEntry>>(
    `${API_URL}/api/v1/feedback-entries`,
    {
      method: 'POST',
      body: JSON.stringify(moodEntry),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as FeedbackEntry;
};

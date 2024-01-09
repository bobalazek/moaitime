import { useQuery, useQueryClient } from 'react-query';

import { MoodEntry } from '@moaitime/shared-common';

import { loadMoodEntries } from '../utils/MoodHelpers';

export const MOOD_ENTRIES_QUERY_KEY = 'mood-entries';

export const useMoodEntriesQuery = () => {
  return useQuery<MoodEntry[]>({
    queryKey: MOOD_ENTRIES_QUERY_KEY,
    queryFn: () => loadMoodEntries(),
  });
};

export const useInvalidateMoodEntriesQuery = () => {
  const queryClient = useQueryClient();

  const invalidateAssetsQuery = () => {
    queryClient.invalidateQueries([MOOD_ENTRIES_QUERY_KEY]);
  };

  return invalidateAssetsQuery;
};

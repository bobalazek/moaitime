import { useInfiniteQuery, useQueryClient } from 'react-query';

import { AsyncReturnType } from '@moaitime/shared-common';

import { loadMoodEntriesRawResponse, MoodEntriesManagerFindOptions } from '../utils/MoodHelpers';

export const MOOD_ENTRIES_QUERY_KEY = 'mood-entries';

export const useMoodEntriesQuery = () => {
  return useInfiniteQuery<AsyncReturnType<typeof loadMoodEntriesRawResponse>>({
    queryKey: MOOD_ENTRIES_QUERY_KEY,
    queryFn: ({ pageParam }) => {
      let params: MoodEntriesManagerFindOptions | undefined = undefined;
      if (pageParam && typeof pageParam === 'string') {
        if (pageParam.startsWith('previousCursor=')) {
          params = {
            previousCursor: pageParam.replace('previousCursor=', ''),
          };
        } else if (pageParam.startsWith('nextCursor=')) {
          params = {
            nextCursor: pageParam.replace('nextCursor=', ''),
          };
        }
      }

      return loadMoodEntriesRawResponse(params);
    },
    getPreviousPageParam: (firstPage) => {
      const previousCursor =
        (firstPage.meta as { previousCursor?: string })?.previousCursor ?? undefined;
      if (!previousCursor) {
        return undefined;
      }

      return `previousCursor=${previousCursor}`;
    },
    getNextPageParam: (lastPage) => {
      const nextCursor = (lastPage.meta as { nextCursor?: string })?.nextCursor ?? undefined;
      if (!nextCursor) {
        return undefined;
      }

      return `nextCursor=${nextCursor}`;
    },
    keepPreviousData: true,
  });
};

export const useInvalidateMoodEntriesQuery = () => {
  const queryClient = useQueryClient();

  const invalidateAssetsQuery = () => {
    queryClient.invalidateQueries([MOOD_ENTRIES_QUERY_KEY]);
  };

  return invalidateAssetsQuery;
};

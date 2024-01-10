import { useInfiniteQuery, useQueryClient } from 'react-query';

import { AsyncReturnType } from '@moaitime/shared-common';

import { loadMoodEntriesRawResponse, MoodEntriesManagerFindOptions } from '../utils/MoodHelpers';

export const MOOD_ENTRIES_QUERY_KEY = 'mood-entries';

export const useMoodEntriesQuery = () => {
  return useInfiniteQuery<AsyncReturnType<typeof loadMoodEntriesRawResponse>>({
    queryKey: MOOD_ENTRIES_QUERY_KEY,
    queryFn: ({ pageParam }) => {
      let params: MoodEntriesManagerFindOptions | undefined = undefined;
      if (pageParam && typeof pageParam === 'string' && pageParam.startsWith('afterCursor=')) {
        params = {
          afterCursor: pageParam.replace('afterCursor=', ''),
        };
      } else if (
        pageParam &&
        typeof pageParam === 'string' &&
        pageParam.startsWith('beforeCursor=')
      ) {
        params = {
          beforeCursor: pageParam.replace('beforeCursor=', ''),
        };
      }

      return loadMoodEntriesRawResponse(params);
    },
    getNextPageParam: (lastPage) => {
      const afterCursor = (lastPage.meta as { afterCursor?: string })?.afterCursor ?? undefined;
      if (!afterCursor) {
        return undefined;
      }

      return `afterCursor=${afterCursor}`;
    },
    getPreviousPageParam: (firstPage) => {
      const beforeCursor = (firstPage.meta as { beforeCursor?: string })?.beforeCursor ?? undefined;
      if (!beforeCursor) {
        return undefined;
      }

      return `beforeCursor=${beforeCursor}`;
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

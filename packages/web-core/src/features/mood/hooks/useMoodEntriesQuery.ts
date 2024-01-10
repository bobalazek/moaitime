// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import { useInfiniteQuery } from '@tanstack/react-query';

import { AsyncReturnType } from '@moaitime/shared-common';

import { loadMoodEntriesRawResponse, MoodEntriesManagerFindOptions } from '../utils/MoodHelpers';

export const MOOD_ENTRIES_QUERY_KEY = 'mood-entries';

export const useMoodEntriesQuery = () => {
  return useInfiniteQuery<AsyncReturnType<typeof loadMoodEntriesRawResponse>>({
    initialPageParam: undefined,
    // Temporary disable until we have a fix for this.
    // Issue is, that pageParam stays the same as the last fetch you did,
    // so if you scroll to bottom when there are no more entries,
    // then it won't work on the refresh anymore.
    // See: https://github.com/TanStack/query/discussions/5692
    refetchOnWindowFocus: false,
    queryKey: [MOOD_ENTRIES_QUERY_KEY],
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
  });
};

// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import { useInfiniteQuery } from '@tanstack/react-query';

import { AsyncReturnType } from '@moaitime/shared-common';

import { getMoodEntriesRawResponse, MoodEntriesManagerFindOptions } from '../utils/MoodHelpers';

export const MOOD_ENTRIES_QUERY_KEY = 'mood-entries';

export const useMoodEntriesQuery = () => {
  return useInfiniteQuery<AsyncReturnType<typeof getMoodEntriesRawResponse>>({
    initialPageParam: undefined,
    maxPages: 5,
    queryKey: [MOOD_ENTRIES_QUERY_KEY],
    queryFn: ({ pageParam, direction }) => {
      let params: MoodEntriesManagerFindOptions | undefined = undefined;
      if (pageParam && typeof pageParam === 'string') {
        // We do NOT want to set the previous cursor if we are going forward,
        // because the only case where going forward and a previous cursor is set is,
        // when we re-fetch the data for a re-connect of window focus.
        // This would we wgong in our case, because if by any chance the user has tried and get the previous page,
        // that would be at the top of the fetch stack. The problem with that is, that if we do this request again,
        // we will not have any next cursor, since there will be no items there.
        if (pageParam.startsWith('previousCursor=') && direction === 'backward') {
          params = {
            previousCursor: pageParam.replace('previousCursor=', ''),
          };
        } else if (pageParam.startsWith('nextCursor=')) {
          params = {
            nextCursor: pageParam.replace('nextCursor=', ''),
          };
        }
      }

      return getMoodEntriesRawResponse(params);
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

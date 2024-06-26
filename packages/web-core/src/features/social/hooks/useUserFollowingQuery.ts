// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import { useInfiniteQuery } from '@tanstack/react-query';

import { AsyncReturnType, PaginationCursorsType } from '@moaitime/shared-common';

import { getUserFollowing } from '../utils/UserHelpers';

export const USER_FOLLOWING_QUERY_KEY = 'user-following';

export const useUserFollowingQuery = (userIdOrUsername: string) => {
  return useInfiniteQuery<AsyncReturnType<typeof getUserFollowing>>({
    initialPageParam: undefined,
    queryKey: [USER_FOLLOWING_QUERY_KEY, userIdOrUsername],
    queryFn: ({ pageParam, direction }) => {
      let params: PaginationCursorsType | undefined = undefined;
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

      return getUserFollowing(userIdOrUsername, params);
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

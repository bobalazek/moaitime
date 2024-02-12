// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { PublicUser } from '@moaitime/shared-common';

import { getUser } from '../utils/UserHelpers';

export const USERS_VIEW_QUERY_KEY = 'users:view';

export const useUsersViewQuery = (userUsername: string) => {
  return useQuery<PublicUser>({
    queryKey: [USERS_VIEW_QUERY_KEY, userUsername],
    queryFn: () => getUser(userUsername),
    retry: false,
  });
};

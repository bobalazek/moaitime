// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { UserAchievement } from '@moaitime/shared-common';

import { getUserAchievements } from '../utils/UserHelpers';

export const USER_ACHIEVEMENTS_QUERY_KEY = 'user:achievements';

export const useUserAchievementsQuery = (userUsername: string) => {
  return useQuery<UserAchievement[]>({
    queryKey: [USER_ACHIEVEMENTS_QUERY_KEY, userUsername],
    queryFn: () => getUserAchievements(userUsername),
    retry: false,
  });
};

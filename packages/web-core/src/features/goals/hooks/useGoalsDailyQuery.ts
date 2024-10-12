// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { Goal } from '@moaitime/shared-common';

import { getGoals } from '../utils/GoalHelpers';

export const GOALS_QUERY_KEY = 'goals';

export const useGoalsQuery = () => {
  return useQuery<Goal[]>({
    queryKey: [GOALS_QUERY_KEY],
    queryFn: () => getGoals(),
    retry: false,
  });
};

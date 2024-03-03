// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { Habit } from '@moaitime/shared-common';

import { getHabits } from '../utils/HabitHelpers';

export const HABITS_QUERY_KEY = 'habits';

export const useHabitsQuery = () => {
  return useQuery<Habit[]>({
    queryKey: [HABITS_QUERY_KEY],
    queryFn: () => getHabits(),
    retry: false,
  });
};

// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { HabitDaily } from '@moaitime/shared-common';

import { getHabitsDaily } from '../utils/HabitHelpers';

export const HABITS_DAILY_QUERY_KEY = 'habits';

export const useHabitsDailyQuery = (date: string) => {
  return useQuery<HabitDaily[]>({
    queryKey: [HABITS_DAILY_QUERY_KEY, date],
    queryFn: () => getHabitsDaily(date),
    retry: false,
  });
};

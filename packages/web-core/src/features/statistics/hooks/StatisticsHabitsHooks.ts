// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  ResponseInterface,
  StatisticsDateCountData,
  StatisticsHabitsBasicData,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

// Habits
export const STATISTICS_HABITS_KEY = 'statistics:habits';

export const getHabitsStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsHabitsBasicData>>(
    `${API_URL}/api/v1/habits-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsHabitsBasicData;
};

export const useHabitsStatisticsQuery = () => {
  return useQuery<StatisticsHabitsBasicData>({
    queryKey: [STATISTICS_HABITS_KEY],
    queryFn: getHabitsStatistics,
  });
};

// Habits - Habits Created Map
export const STATISTICS_HABITS_HABITS_CREATED_KEY = 'statistics:habits:habits-created';

export const getHabitsStatisticsHabitsCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/habits-statistics/habits-created`);

  if (from) {
    url.searchParams.append('from', from.toISOString());
  }

  if (to) {
    url.searchParams.append('to', to.toISOString());
  }

  const response = await fetchJson<ResponseInterface<StatisticsDateCountData>>(url.toString(), {
    method: 'GET',
  });

  return response.data as StatisticsDateCountData;
};

export const useHabitsStatisticsHabitsCreatedQuery = ({ from, to }: { from?: Date; to?: Date }) => {
  const queryKey = [STATISTICS_HABITS_HABITS_CREATED_KEY, from, to];
  const queryFn = () => getHabitsStatisticsHabitsCreated(from, to);

  return useQuery<StatisticsDateCountData>({
    queryKey,
    queryFn,
  });
};

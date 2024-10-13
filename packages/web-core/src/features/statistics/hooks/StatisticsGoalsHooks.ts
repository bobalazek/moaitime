// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  ResponseInterface,
  StatisticsDateCountData,
  StatisticsGoalsBasicData,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

// Goals
export const STATISTICS_GOALS_KEY = 'statistics:goals';

export const getGoalsStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsGoalsBasicData>>(
    `${API_URL}/api/v1/goals-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsGoalsBasicData;
};

export const useGoalsStatisticsQuery = () => {
  return useQuery<StatisticsGoalsBasicData>({
    queryKey: [STATISTICS_GOALS_KEY],
    queryFn: getGoalsStatistics,
  });
};

// Goals - Goals Created Map
export const STATISTICS_GOALS_GOALS_CREATED_KEY = 'statistics:goals:goals-created';

export const getGoalsStatisticsGoalsCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/goals-statistics/goals-created`);

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

export const useGoalsStatisticsGoalsCreatedQuery = ({ from, to }: { from?: Date; to?: Date }) => {
  const queryKey = [STATISTICS_GOALS_GOALS_CREATED_KEY, from, to];
  const queryFn = () => getGoalsStatisticsGoalsCreated(from, to);

  return useQuery<StatisticsDateCountData>({
    queryKey,
    queryFn,
  });
};

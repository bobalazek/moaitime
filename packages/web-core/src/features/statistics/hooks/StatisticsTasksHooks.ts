// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { API_URL, ResponseInterface, StatisticsTasksBasicData } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

// Tasks
// Tasks - Basics
export const STATISTICS_TASKS_KEY = 'statistics:tasks';

export const getTasksStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsTasksBasicData>>(
    `${API_URL}/api/v1/tasks-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsTasksBasicData;
};

export const useTasksStatisticsQuery = () => {
  return useQuery<StatisticsTasksBasicData>({
    queryKey: [STATISTICS_TASKS_KEY],
    queryFn: getTasksStatistics,
  });
};

// Tasks - Tasks Created Map
export const STATISTICS_TASKS_DATE_COUNT_MAP_KEY = 'statistics:tasks:tasks-created';

export const getTasksStatisticsTasksCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/tasks-statistics/tasks-created`);

  if (from) {
    url.searchParams.append('from', from.toISOString());
  }

  if (to) {
    url.searchParams.append('to', to.toISOString());
  }

  const response = await fetchJson<ResponseInterface<StatisticsTasksBasicData>>(url.toString(), {
    method: 'GET',
  });

  return response.data as StatisticsTasksBasicData;
};

export const useTasksStatisticsTasksCreatedQuery = ({ from, to }: { from?: Date; to?: Date }) => {
  const queryKey = [STATISTICS_TASKS_DATE_COUNT_MAP_KEY, from, to];
  const queryFn = () => getTasksStatisticsTasksCreated(from, to);

  return useQuery<StatisticsTasksBasicData>({
    queryKey,
    queryFn,
  });
};

// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  API_URL,
  ResponseInterface,
  StatisticsCalendarBasicData,
  StatisticsGeneralBasicData,
  StatisticsTasksBasicData,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

// General
export const STATISTICS_GENERAL_KEY = 'statistics:general';

export const getGeneralStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsGeneralBasicData>>(
    `${API_URL}/api/v1/statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsGeneralBasicData;
};

export const useStatisticsGeneralQuery = () => {
  return useQuery<StatisticsGeneralBasicData>({
    queryKey: [STATISTICS_GENERAL_KEY],
    queryFn: getGeneralStatistics,
  });
};

// Calendar
export const STATISTICS_CALENDAR_KEY = 'statistics:calendar';

export const getCalendarStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsCalendarBasicData>>(
    `${API_URL}/api/v1/calendar-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsCalendarBasicData;
};

export const useStatisticsCalendarQuery = () => {
  return useQuery<StatisticsCalendarBasicData>({
    queryKey: [STATISTICS_CALENDAR_KEY],
    queryFn: getCalendarStatistics,
  });
};

// Tasks
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

export const useStatisticsTasksQuery = () => {
  return useQuery<StatisticsTasksBasicData>({
    queryKey: [STATISTICS_TASKS_KEY],
    queryFn: getTasksStatistics,
  });
};

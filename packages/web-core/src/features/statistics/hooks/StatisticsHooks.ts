// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  API_URL,
  ResponseInterface,
  StatisticsCalendarBasicData,
  StatisticsFocusBasicData,
  StatisticsGeneralBasicData,
  StatisticsMoodBasicData,
  StatisticsNotesBasicData,
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

export const useGeneralStatisticsQuery = () => {
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

export const useCalendarStatisticsQuery = () => {
  return useQuery<StatisticsCalendarBasicData>({
    queryKey: [STATISTICS_CALENDAR_KEY],
    queryFn: getCalendarStatistics,
  });
};

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

// Notes
export const STATISTICS_NOTES_KEY = 'statistics:notes';

export const getNotesStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsNotesBasicData>>(
    `${API_URL}/api/v1/notes-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsNotesBasicData;
};

export const useNotesStatisticsQuery = () => {
  return useQuery<StatisticsNotesBasicData>({
    queryKey: [STATISTICS_NOTES_KEY],
    queryFn: getNotesStatistics,
  });
};

// Mood
export const STATISTICS_MOOD_KEY = 'statistics:mood';

export const getMoodStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsMoodBasicData>>(
    `${API_URL}/api/v1/mood-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsMoodBasicData;
};

export const useMoodStatisticsQuery = () => {
  return useQuery<StatisticsMoodBasicData>({
    queryKey: [STATISTICS_MOOD_KEY],
    queryFn: getMoodStatistics,
  });
};

// Focus
export const STATISTICS_FOCUS_KEY = 'statistics:focus';

export const getFocusStatistics = async () => {
  const response = await fetchJson<ResponseInterface<StatisticsFocusBasicData>>(
    `${API_URL}/api/v1/focus-statistics`,
    {
      method: 'GET',
    }
  );

  return response.data as StatisticsFocusBasicData;
};

export const useFocusStatisticsQuery = () => {
  return useQuery<StatisticsFocusBasicData>({
    queryKey: [STATISTICS_FOCUS_KEY],
    queryFn: getFocusStatistics,
  });
};

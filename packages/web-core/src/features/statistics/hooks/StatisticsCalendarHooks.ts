// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  API_URL,
  ResponseInterface,
  StatisticsCalendarBasicData,
  StatisticsDateCountData,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

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

// Calendar - Events Created Map
export const STATISTICS_CALENDAR_EVENTS_CREATED_KEY = 'statistics:calendar:events-created';

export const getCalendarStatisticsEventsCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/calendar-statistics/events-created`);

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

export const useCalendarStatisticsEventsCreatedQuery = ({
  from,
  to,
}: {
  from?: Date;
  to?: Date;
}) => {
  const queryKey = [STATISTICS_CALENDAR_EVENTS_CREATED_KEY, from, to];
  const queryFn = () => getCalendarStatisticsEventsCreated(from, to);

  return useQuery<StatisticsDateCountData>({
    queryKey,
    queryFn,
  });
};

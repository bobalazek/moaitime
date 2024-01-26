// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { API_URL, ResponseInterface, StatisticsCalendarBasicData } from '@moaitime/shared-common';

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

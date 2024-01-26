// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  API_URL,
  ResponseInterface,
  StatisticsDateCountData,
  StatisticsFocusBasicData,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

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

// Focus - Focus Sessions Created Map
export const STATISTICS_FOCUS_FOCUS_SESSIONS_CREATED_KEY =
  'statistics:focus:focus-sessions-created';

export const getFocusStatisticsFocusSessionsCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/focus-statistics/focus-sessions-created`);

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

export const useFocusStatisticsFocusSessionsCreatedQuery = ({
  from,
  to,
}: {
  from?: Date;
  to?: Date;
}) => {
  const queryKey = [STATISTICS_FOCUS_FOCUS_SESSIONS_CREATED_KEY, from, to];
  const queryFn = () => getFocusStatisticsFocusSessionsCreated(from, to);

  return useQuery<StatisticsDateCountData>({
    queryKey,
    queryFn,
  });
};

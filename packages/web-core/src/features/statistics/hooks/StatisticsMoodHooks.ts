// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  ResponseInterface,
  StatisticsDateCountData,
  StatisticsMoodBasicData,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

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

// Mood - Mood Entries Created Map
export const STATISTICS_MOOD_MOOD_ENTRIES_CREATED_KEY = 'statistics:mood:mood-entries-created';

export const getMoodStatisticsMoodEntriesCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/mood-statistics/mood-entries-created`);

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

export const useMoodStatisticsMoodEntriesCreatedQuery = ({
  from,
  to,
}: {
  from?: Date;
  to?: Date;
}) => {
  const queryKey = [STATISTICS_MOOD_MOOD_ENTRIES_CREATED_KEY, from, to];
  const queryFn = () => getMoodStatisticsMoodEntriesCreated(from, to);

  return useQuery<StatisticsDateCountData>({
    queryKey,
    queryFn,
  });
};

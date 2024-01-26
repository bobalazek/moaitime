// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { API_URL, ResponseInterface, StatisticsMoodBasicData } from '@moaitime/shared-common';

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

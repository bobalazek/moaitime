// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { API_URL, ResponseInterface, StatisticsGeneralBasicData } from '@moaitime/shared-common';

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

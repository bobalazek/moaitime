// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import { StatisticsGeneral } from '@moaitime/shared-common';

import { getGeneralStatistics } from '../utils/StatisticsHelpers';

// General
export const STATISTICS_GENERAL_KEY = 'statistics:general';

export const useStatisticsGeneralQuery = () => {
  return useQuery<StatisticsGeneral>({
    queryKey: [STATISTICS_GENERAL_KEY],
    queryFn: getGeneralStatistics,
  });
};

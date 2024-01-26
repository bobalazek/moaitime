// Need to have this, else typescript won't work...
// https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';

import {
  API_URL,
  ResponseInterface,
  StatisticsDateCountData,
  StatisticsNotesBasicData,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

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

// Notes - Notes Created Map
export const STATISTICS_NOTES_NOTES_CREATED_KEY = 'statistics:notes:notes-created';

export const getNotesStatisticsNotesCreated = async (from?: Date, to?: Date) => {
  const url = new URL(`${API_URL}/api/v1/notes-statistics/notes-created`);

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

export const useNotesStatisticsNotesCreatedQuery = ({ from, to }: { from?: Date; to?: Date }) => {
  const queryKey = [STATISTICS_NOTES_NOTES_CREATED_KEY, from, to];
  const queryFn = () => getNotesStatisticsNotesCreated(from, to);

  return useQuery<StatisticsDateCountData>({
    queryKey,
    queryFn,
  });
};

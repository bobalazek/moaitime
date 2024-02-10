import { API_URL, ChangelogEntry, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const getChangelogEntries = async (): Promise<ChangelogEntry[]> => {
  const response = await fetchJson<ResponseInterface<ChangelogEntry[]>>(
    `${API_URL}/api/v1/changelog-entries`,
    {
      method: 'GET',
    }
  );

  return response.data as ChangelogEntry[];
};

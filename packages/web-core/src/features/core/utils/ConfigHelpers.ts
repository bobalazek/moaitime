import { API_URL, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from './FetchHelpers';

export const getConfig = async () => {
  const response = await fetchJson<ResponseInterface<{ version: string; websocketUrl: string }>>(
    `${API_URL}/api/v1/config`,
    {
      method: 'GET',
    }
  );

  return response.data;
};

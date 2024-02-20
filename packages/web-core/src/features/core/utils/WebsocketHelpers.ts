import { API_URL, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from './FetchHelpers';

export const getWebsocketUrl = async () => {
  const response = await fetchJson<ResponseInterface<{ websocketUrl: string }>>(
    `${API_URL}/api/v1/websocket`,
    {
      method: 'GET',
    }
  );

  return response.data?.websocketUrl;
};

import { API_URL, BackgroundInterface, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const getBackgrounds = async () => {
  const response = await fetchJson<ResponseInterface<BackgroundInterface[]>>(
    `${API_URL}/api/v1/backgrounds`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

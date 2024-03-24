import { BackgroundInterface, ResponseInterface } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

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

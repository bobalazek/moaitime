import { API_URL, BackgroundInterface, ResponseInterface } from '@myzenbuddy/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const loadBackgrounds = async () => {
  const response = await fetchJson<ResponseInterface<BackgroundInterface[]>>(
    `${API_URL}/api/v1/backgrounds`,
    {
      method: 'GET',
    }
  );

  return response;
};

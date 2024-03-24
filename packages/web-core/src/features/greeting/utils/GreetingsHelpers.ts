import { GreetingInterface, ResponseInterface } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const getGreetings = async () => {
  const response = await fetchJson<ResponseInterface<GreetingInterface[]>>(
    `${API_URL}/api/v1/greetings`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

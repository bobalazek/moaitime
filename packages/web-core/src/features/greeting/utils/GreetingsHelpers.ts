import { API_URL, GreetingInterface, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const loadGreetings = async () => {
  const response = await fetchJson<ResponseInterface<GreetingInterface[]>>(
    `${API_URL}/api/v1/greetings`,
    {
      method: 'GET',
    }
  );

  return response;
};

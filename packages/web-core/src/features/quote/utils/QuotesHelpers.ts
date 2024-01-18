import { API_URL, QuoteInterface, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const getQuotes = async () => {
  const response = await fetchJson<ResponseInterface<QuoteInterface[]>>(
    `${API_URL}/api/v1/quotes`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

import { API_URL, QuoteInterface, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const loadQuotes = async () => {
  const response = await fetchJson<ResponseInterface<QuoteInterface[]>>(
    `${API_URL}/api/v1/quotes`,
    {
      method: 'GET',
    }
  );

  return response;
};

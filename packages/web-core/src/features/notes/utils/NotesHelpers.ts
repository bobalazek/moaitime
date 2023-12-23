import { API_URL, Note, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Notes **********/
export const loadNotes = async () => {
  const response = await fetchJson<ResponseInterface<Note[]>>(`${API_URL}/api/v1/notes`, {
    method: 'GET',
  });

  return response.data as Note[];
};

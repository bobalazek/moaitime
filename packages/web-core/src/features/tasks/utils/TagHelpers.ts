import { API_URL, CreateTag, ResponseInterface, Tag } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Tags **********/
export const loadTags = async () => {
  const response = await fetchJson<ResponseInterface<Tag[]>>(`${API_URL}/api/v1/tags`, {
    method: 'GET',
  });

  return response.data ?? [];
};

export const getTag = async (tagId: string): Promise<Tag> => {
  const response = await fetchJson<ResponseInterface<Tag>>(`${API_URL}/api/v1/tags/${tagId}`, {
    method: 'GET',
  });

  return response.data as Tag;
};

export const addTag = async (task: CreateTag): Promise<Tag> => {
  const response = await fetchJson<ResponseInterface<Tag>>(`${API_URL}/api/v1/tags`, {
    method: 'POST',
    body: JSON.stringify(task),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Tag;
};

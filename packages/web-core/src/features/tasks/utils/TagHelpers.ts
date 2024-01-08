import { API_URL, CreateTag, ResponseInterface, Tag, UpdateTag } from '@moaitime/shared-common';

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

export const addTag = async (tag: CreateTag): Promise<Tag> => {
  const response = await fetchJson<ResponseInterface<Tag>>(`${API_URL}/api/v1/tags`, {
    method: 'POST',
    body: JSON.stringify(tag),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Tag;
};

export const editTag = async (tagId: string, tag: UpdateTag): Promise<Tag> => {
  const response = await fetchJson<ResponseInterface<Tag>>(`${API_URL}/api/v1/tags/${tagId}`, {
    method: 'PATCH',
    body: JSON.stringify(tag),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Tag;
};

export const deleteTag = async (tagId: string, isHardDelete?: boolean): Promise<Tag> => {
  const response = await fetchJson<ResponseInterface<Tag>>(`${API_URL}/api/v1/tags/${tagId}`, {
    method: 'DELETE',
    body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Tag;
};

export const undeleteTag = async (tagId: string): Promise<Tag> => {
  const response = await fetchJson<ResponseInterface<Tag>>(
    `${API_URL}/api/v1/tags/${tagId}/undelete`,
    {
      method: 'POST',
    }
  );

  return response.data as Tag;
};

import { CreateTag, ResponseInterface, Tag, UpdateTag } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Tags **********/
export const getTags = async (options?: { includeDeleted?: boolean }) => {
  const url = new URL(`${API_URL}/api/v1/tags`);

  if (options?.includeDeleted) {
    url.searchParams.set('includeDeleted', 'true');
  }

  const response = await fetchJson<ResponseInterface<Tag[]>>(url.toString(), {
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

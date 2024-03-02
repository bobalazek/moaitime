import { API_URL, PaginationCursorsType, Post, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const getFeed = async (userIdOrUsername?: string, options?: PaginationCursorsType) => {
  const url = new URL(
    userIdOrUsername
      ? `${API_URL}/api/v1/users/${userIdOrUsername}/followers`
      : `${API_URL}/api/v1/feed`
  );

  if (options?.previousCursor) {
    url.searchParams.append('previousCursor', options.previousCursor);
  }

  if (options?.nextCursor) {
    url.searchParams.append('nextCursor', options.nextCursor);
  }

  const response = await fetchJson<ResponseInterface<Post[]>>(url.toString(), {
    method: 'GET',
  });

  return response;
};

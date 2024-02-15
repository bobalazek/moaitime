import {
  API_URL,
  PaginationCursorsType,
  PublicUser,
  ResponseInterface,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Users **********/
export const getUser = async (userIdOrUsername: string) => {
  const response = await fetchJson<ResponseInterface<PublicUser>>(
    `${API_URL}/api/v1/users/${userIdOrUsername}`,
    {
      method: 'GET',
    },
    {
      preventToast: true,
    }
  );

  return response.data as PublicUser;
};

export const getUserFollowers = async (
  userIdOrUsername: string,
  options?: PaginationCursorsType
) => {
  const url = new URL(`${API_URL}/api/v1/users/${userIdOrUsername}/followers`);

  if (options?.previousCursor) {
    url.searchParams.append('previousCursor', options.previousCursor);
  }

  if (options?.nextCursor) {
    url.searchParams.append('nextCursor', options.nextCursor);
  }

  const response = await fetchJson<ResponseInterface<PublicUser[]>>(url.toString(), {
    method: 'GET',
  });

  return response;
};

export const getUserFollowing = async (
  userIdOrUsername: string,
  options?: PaginationCursorsType
) => {
  const url = new URL(`${API_URL}/api/v1/users/${userIdOrUsername}/following`);

  if (options?.previousCursor) {
    url.searchParams.append('previousCursor', options.previousCursor);
  }

  if (options?.nextCursor) {
    url.searchParams.append('nextCursor', options.nextCursor);
  }

  const response = await fetchJson<ResponseInterface<PublicUser[]>>(url.toString(), {
    method: 'GET',
  });

  return response;
};

export const followUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/follow`, {
    method: 'POST',
  });

  return true;
};

export const unfollowUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/unfollow`, {
    method: 'POST',
  });

  return true;
};

export const blockUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/block`, {
    method: 'POST',
  });

  return true;
};

export const unblockUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/unblock`, {
    method: 'POST',
  });

  return true;
};

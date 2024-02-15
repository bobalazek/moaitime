import { API_URL, PublicUser, ResponseInterface } from '@moaitime/shared-common';

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

export const getUserFollowers = async (userIdOrUsername: string) => {
  const response = await fetchJson<ResponseInterface<PublicUser[]>>(
    `${API_URL}/api/v1/users/${userIdOrUsername}/followers`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
};

export const getUserFollowing = async (userIdOrUsername: string) => {
  const response = await fetchJson<ResponseInterface<PublicUser[]>>(
    `${API_URL}/api/v1/users/${userIdOrUsername}/following`,
    {
      method: 'GET',
    }
  );

  return response.data ?? [];
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

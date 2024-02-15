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

export const getUserLastActive = async (userIdOrUsername: string) => {
  const response = await fetchJson<ResponseInterface<{ lastActiveAt: string | null }>>(
    `${API_URL}/api/v1/users/${userIdOrUsername}/last-active`,
    {
      method: 'GET',
    }
  );

  return response.data?.lastActiveAt ? new Date(response.data.lastActiveAt) : null;
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

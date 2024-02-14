import { API_URL, PublicUser, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Users **********/
export const getUser = async (userUsername: string) => {
  const response = await fetchJson<ResponseInterface<PublicUser>>(
    `${API_URL}/api/v1/users/${userUsername}`,
    {
      method: 'GET',
    },
    {
      preventToast: true,
    }
  );

  return response.data as PublicUser;
};

export const getUserLastActive = async (userUsername: string) => {
  const response = await fetchJson<ResponseInterface<{ lastActiveAt: string | null }>>(
    `${API_URL}/api/v1/users/${userUsername}/last-active`,
    {
      method: 'GET',
    }
  );

  return response.data?.lastActiveAt ? new Date(response.data.lastActiveAt) : null;
};

export const followUser = async (userUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userUsername}/follow`, {
    method: 'POST',
  });

  return true;
};

export const unfollowUser = async (userUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userUsername}/unfollow`, {
    method: 'POST',
  });

  return true;
};

export const blockUser = async (userUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userUsername}/block`, {
    method: 'POST',
  });

  return true;
};

export const unblockUser = async (userUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userUsername}/unblock`, {
    method: 'POST',
  });

  return true;
};

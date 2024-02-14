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

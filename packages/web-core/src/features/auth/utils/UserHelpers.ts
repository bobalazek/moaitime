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

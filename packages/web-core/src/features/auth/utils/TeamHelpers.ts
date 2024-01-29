import { API_URL, JoinedTeam, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Joined Team **********/
export const getJoinedTeam = async () => {
  const response = await fetchJson<ResponseInterface<JoinedTeam>>(
    `${API_URL}/api/v1/teams/joined`,
    {
      method: 'GET',
    }
  );

  return response.data as JoinedTeam;
};

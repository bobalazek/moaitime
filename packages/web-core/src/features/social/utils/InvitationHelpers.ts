import { Invitation, ResponseInterface } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Invitations **********/
export const getInvitations = async () => {
  const response = await fetchJson<ResponseInterface<Invitation[]>>(
    `${API_URL}/api/v1/invitations`,
    {
      method: 'GET',
    }
  );

  return response.data as Invitation[];
};

export const sendInvitation = async (email: string) => {
  const response = await fetchJson<ResponseInterface<Invitation>>(`${API_URL}/api/v1/invitations`, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Invitation;
};

export const deleteInvitation = async (invitationId: string) => {
  const response = await fetchJson<ResponseInterface<Invitation>>(
    `${API_URL}/api/v1/invitations/${invitationId}`,
    {
      method: 'DELETE',
    }
  );

  return response.data as Invitation;
};

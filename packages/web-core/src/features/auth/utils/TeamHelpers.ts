import {
  API_URL,
  CreateTeam,
  JoinedTeam,
  ResponseInterface,
  Team,
  TeamUserInvitation,
  UpdateTeam,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Teams **********/
export const addTeam = async (team: CreateTeam): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(`${API_URL}/api/v1/teams`, {
    method: 'POST',
    body: JSON.stringify(team),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Team;
};

export const editTeam = async (teamId: string, team: UpdateTeam): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(`${API_URL}/api/v1/teams/${teamId}`, {
    method: 'PATCH',
    body: JSON.stringify(team),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Team;
};

export const deleteTeam = async (teamId: string): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(`${API_URL}/api/v1/teams/${teamId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Team;
};

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

/********** Team Invitations **********/
export const getTeamInvitations = async (teamId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation[]>>(
    `${API_URL}/api/v1/teams/${teamId}/invitations`,
    {
      method: 'GET',
    }
  );

  return response.data as TeamUserInvitation[];
};

export const sendTeamInvitation = async (teamId: string, email: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation>>(
    `${API_URL}/api/v1/teams/${teamId}/invite`,
    {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as TeamUserInvitation;
};

export const acceptTeamInvitation = async (teamUserInvitationId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation>>(
    `${API_URL}/api/v1/teams/${teamUserInvitationId}/accept`,
    {
      method: 'POST',
    }
  );

  return response.data as TeamUserInvitation;
};

export const rejectTeamInvitation = async (teamUserInvitationId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation>>(
    `${API_URL}/api/v1/teams/${teamUserInvitationId}/reject`,
    {
      method: 'POST',
    }
  );

  return response.data as TeamUserInvitation;
};

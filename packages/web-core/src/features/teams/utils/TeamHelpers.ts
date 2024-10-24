import {
  CreateTeam,
  JoinedTeam,
  ResponseInterface,
  Team,
  TeamUser,
  TeamUserInvitation,
  UpdateTeam,
  UpdateTeamUser,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Teams **********/
export const addTeam = async (data: CreateTeam): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(`${API_URL}/api/v1/teams`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Team;
};

export const editTeam = async (teamId: string, data: UpdateTeam): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(`${API_URL}/api/v1/teams/${teamId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Team;
};

export const getTeam = async (teamId: string): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(`${API_URL}/api/v1/teams/${teamId}`, {
    method: 'GET',
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

export const leaveTeam = async (teamId: string): Promise<Team> => {
  const response = await fetchJson<ResponseInterface<Team>>(
    `${API_URL}/api/v1/teams/${teamId}/leave`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Team;
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

/********** Team Members **********/
export const getTeamMembers = async (teamId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUser[]>>(
    `${API_URL}/api/v1/teams/${teamId}/members`,
    {
      method: 'GET',
    }
  );

  return response.data as TeamUser[];
};

export const removeTeamMember = async (teamId: string, userId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUser>>(
    `${API_URL}/api/v1/teams/${teamId}/members/${userId}`,
    {
      method: 'DELETE',
    }
  );

  return response.data as TeamUser;
};

export const editTeamMember = async (teamId: string, userId: string, data: UpdateTeamUser) => {
  const response = await fetchJson<ResponseInterface<TeamUser>>(
    `${API_URL}/api/v1/teams/${teamId}/members/${userId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as TeamUser;
};

/********** Joined Team **********/
export const getJoinedTeam = async () => {
  const response = await fetchJson<ResponseInterface<JoinedTeam>>(`${API_URL}/api/v1/joined-team`, {
    method: 'GET',
  });

  return response.data as JoinedTeam;
};

/********** Team User Invitations **********/
export const acceptTeamInvitation = async (teamUserInvitationId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation>>(
    `${API_URL}/api/v1/team-user-invitations/${teamUserInvitationId}/accept`,
    {
      method: 'POST',
    }
  );

  return response.data as TeamUserInvitation;
};

export const rejectTeamInvitation = async (teamUserInvitationId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation>>(
    `${API_URL}/api/v1/team-user-invitations/${teamUserInvitationId}/reject`,
    {
      method: 'POST',
    }
  );

  return response.data as TeamUserInvitation;
};

export const deleteTeamInvitation = async (teamUserInvitationId: string) => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation>>(
    `${API_URL}/api/v1/team-user-invitations/${teamUserInvitationId}`,
    {
      method: 'DELETE',
    }
  );

  return response.data as TeamUserInvitation;
};

/********** My Team Invitations **********/
export const getMyTeamInvitations = async () => {
  const response = await fetchJson<ResponseInterface<TeamUserInvitation[]>>(
    `${API_URL}/api/v1/team-user-invitations/my`,
    {
      method: 'GET',
    }
  );

  return response.data as TeamUserInvitation[];
};

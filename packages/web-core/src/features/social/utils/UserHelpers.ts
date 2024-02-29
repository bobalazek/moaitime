import {
  API_URL,
  CreateReport,
  PaginationCursorsType,
  PublicUser,
  ResponseInterface,
  UserAchievement,
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

export const getUserFollowRequests = async (
  userIdOrUsername: string,
  options?: PaginationCursorsType
) => {
  const url = new URL(`${API_URL}/api/v1/users/${userIdOrUsername}/follow-requests`);

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

export const getUserAchievements = async (userIdOrUsername: string) => {
  const response = await fetchJson<ResponseInterface<UserAchievement[]>>(
    `${API_URL}/api/v1/users/${userIdOrUsername}/achievements`,
    {
      method: 'GET',
    }
  );

  return response.data as UserAchievement[];
};

export const getUserSearch = async (query?: string, options?: PaginationCursorsType) => {
  const url = new URL(`${API_URL}/api/v1/users`);

  if (query) {
    url.searchParams.append('query', query);
  }

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
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return true;
};

export const approveFollowerUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/approve-follower`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return true;
};

export const removeFollowerUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/remove-follower`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return true;
};

export const blockUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/block`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return true;
};

export const unblockUser = async (userIdOrUsername: string) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/unblock`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return true;
};

export const reportUser = async (userIdOrUsername: string, data: CreateReport) => {
  await fetchJson(`${API_URL}/api/v1/users/${userIdOrUsername}/report`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return true;
};

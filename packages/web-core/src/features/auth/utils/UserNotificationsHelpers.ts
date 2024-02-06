import { API_URL, ResponseInterface, UserNotification } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** User sNotifications **********/
export type NotificationsManagerFindOptions = {
  previousCursor?: string;
  nextCursor?: string;
};

export const getUserNotificationsRawResponse = async (
  options?: NotificationsManagerFindOptions
) => {
  const url = new URL(`${API_URL}/api/v1/user-notifications`);

  if (options?.previousCursor) {
    url.searchParams.append('previousCursor', options.previousCursor);
  }

  if (options?.nextCursor) {
    url.searchParams.append('nextCursor', options.nextCursor);
  }

  return fetchJson<ResponseInterface<UserNotification[]>>(url.toString(), {
    method: 'GET',
  });
};

export const getUserNotifications = async (): Promise<UserNotification[]> => {
  const response = await getUserNotificationsRawResponse();

  return response.data ?? [];
};

export const markUserNotificationAsRead = async (userNotificationId: string) => {
  const response = await fetchJson<ResponseInterface<UserNotification>>(
    `${API_URL}/api/v1/user-notifications/${userNotificationId}/mark-as-read`,
    {
      method: 'POST',
    }
  );

  return response.data as UserNotification;
};

export const markUserNotificationAsUnread = async (userNotificationId: string) => {
  const response = await fetchJson<ResponseInterface<UserNotification>>(
    `${API_URL}/api/v1/user-notifications/${userNotificationId}/mark-as-unread`,
    {
      method: 'POST',
    }
  );

  return response.data as UserNotification;
};

export const markUserNotificationAsSeen = async (userNotificationId: string) => {
  const response = await fetchJson<ResponseInterface<UserNotification>>(
    `${API_URL}/api/v1/user-notifications/${userNotificationId}/mark-as-seen`,
    {
      method: 'POST',
    }
  );

  return response.data as UserNotification;
};

export const markUserNotificationsAsUnseen = async (userNotificationId: string) => {
  const response = await fetchJson<ResponseInterface<UserNotification[]>>(
    `${API_URL}/api/v1/user-notifications/${userNotificationId}/mark-as-unseen`,
    {
      method: 'POST',
    }
  );

  return response.data as UserNotification[];
};

export const countUnseenUserNotifications = async () => {
  const response = await fetchJson<ResponseInterface<number>>(
    `${API_URL}/api/v1/user-notifications/unseen-count`,
    {
      method: 'GET',
    }
  );

  return response.data;
};

export const countUnreadUserNotifications = async () => {
  const response = await fetchJson<ResponseInterface<number>>(
    `${API_URL}/api/v1/user-notifications/unread-count`,
    {
      method: 'GET',
    }
  );

  return response.data;
};

import { create } from 'zustand';

import { GlobalEventsEnum, UserNotification } from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  markUserNotificationAsRead,
  markUserNotificationAsUnread,
} from '../utils/UserNotificationsHelpers';

export type UserNotificationsStore = {
  markUserNotificationAsRead: (userNotificationId: string) => Promise<UserNotification>;
  markUserNotificationAsUnread: (userNotificationId: string) => Promise<UserNotification>;
};

export const useUserNotificationsStore = create<UserNotificationsStore>()(() => ({
  markUserNotificationAsRead: async (userNotificationId) => {
    const userNotification = await markUserNotificationAsRead(userNotificationId);

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_NOTIFICATION_MARKED_AS_READ, {
      userId: userNotification.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  },
  markUserNotificationAsUnread: async (userNotificationId) => {
    const userNotification = await markUserNotificationAsUnread(userNotificationId);

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_NOTIFICATION_MARKED_AS_UNREAD, {
      userId: userNotification.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  },
}));

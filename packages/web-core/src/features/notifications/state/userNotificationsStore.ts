import { create } from 'zustand';

import { GlobalEventsEnum, UserNotification } from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  deleteUserNotification,
  getUnreadUserNotificationsCount,
  markUserNotificationAsRead,
  markUserNotificationAsUnread,
} from '../utils/UserNotificationsHelpers';

export type UserNotificationsStore = {
  unreadUserNotificationsCount: number;
  reloadUnreadUserNotificationsCount: () => Promise<number>;
  markUserNotificationAsRead: (userNotificationId: string) => Promise<UserNotification>;
  markUserNotificationAsUnread: (userNotificationId: string) => Promise<UserNotification>;
  deleteUserNotification: (userNotificationId: string) => Promise<UserNotification>;
};

export const useUserNotificationsStore = create<UserNotificationsStore>()((set) => ({
  unreadUserNotificationsCount: 0,
  reloadUnreadUserNotificationsCount: async () => {
    const unreadUserNotificationsCount = await getUnreadUserNotificationsCount();

    set({
      unreadUserNotificationsCount,
    });

    return unreadUserNotificationsCount;
  },
  markUserNotificationAsRead: async (userNotificationId) => {
    const userNotification = await markUserNotificationAsRead(userNotificationId);

    set((state) => ({
      unreadUserNotificationsCount: state.unreadUserNotificationsCount - 1,
    }));

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ, {
      userId: userNotification.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  },
  markUserNotificationAsUnread: async (userNotificationId) => {
    const userNotification = await markUserNotificationAsUnread(userNotificationId);

    set((state) => ({
      unreadUserNotificationsCount: state.unreadUserNotificationsCount + 1,
    }));

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_UNREAD, {
      userId: userNotification.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  },
  deleteUserNotification: async (userNotificationId) => {
    const userNotification = await deleteUserNotification(userNotificationId);

    set((state) => ({
      unreadUserNotificationsCount: state.unreadUserNotificationsCount - 1,
    }));

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_DELETED, {
      userId: userNotification.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  },
}));

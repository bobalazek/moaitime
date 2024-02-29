import { create } from 'zustand';

import { GlobalEventsEnum, UserNotification } from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  deleteUserNotification,
  getUnreadUserNotificationsCount,
  getUserNotification,
  markAllUserNotificationsAsRead,
  markUserNotificationAsRead,
  markUserNotificationAsUnread,
} from '../utils/UserNotificationsHelpers';

export type UserNotificationsStore = {
  unreadUserNotificationsCount: number;
  reloadUnreadUserNotificationsCount: () => Promise<number>;
  markAllUserNotificationsAsRead: () => Promise<void>;
  getUserNotification: (userNotificationId: string) => Promise<UserNotification>;
  markUserNotificationAsRead: (userNotificationId: string) => Promise<UserNotification>;
  markUserNotificationAsUnread: (userNotificationId: string) => Promise<UserNotification>;
  deleteUserNotification: (userNotificationId: string) => Promise<UserNotification>;
  // Unread Only
  unreadOnly: boolean;
  setUnreadOnly: (unreadOnly: boolean) => void;
};

export const useUserNotificationsStore = create<UserNotificationsStore>()((set, get) => ({
  unreadUserNotificationsCount: 0,
  reloadUnreadUserNotificationsCount: async () => {
    const unreadUserNotificationsCount = await getUnreadUserNotificationsCount();

    set({
      unreadUserNotificationsCount,
    });

    return unreadUserNotificationsCount;
  },
  markAllUserNotificationsAsRead: async () => {
    const { reloadUnreadUserNotificationsCount } = get();
    const { auth } = useAuthStore.getState();

    await markAllUserNotificationsAsRead();

    await reloadUnreadUserNotificationsCount();

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_ALL_AS_READ, {
      actorUserId: auth!.user.id,
    });
  },
  getUserNotification: async (userNotificationId: string) => {
    const userNotification = await getUserNotification(userNotificationId);

    return userNotification;
  },
  markUserNotificationAsRead: async (userNotificationId) => {
    const userNotification = await markUserNotificationAsRead(userNotificationId);

    set((state) => ({
      unreadUserNotificationsCount: state.unreadUserNotificationsCount - 1,
    }));

    globalEventsEmitter.emit(GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ, {
      actorUserId: userNotification.userId,
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
      actorUserId: userNotification.userId,
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
      actorUserId: userNotification.userId,
      userNotificationId: userNotification.id,
    });

    return userNotification;
  },
  // Unread
  unreadOnly: false,
  setUnreadOnly: (unreadOnly: boolean) => {
    set({
      unreadOnly,
    });
  },
}));

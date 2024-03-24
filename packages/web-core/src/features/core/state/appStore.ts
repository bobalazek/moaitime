import { create } from 'zustand';

import { ThemeEnum } from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';
import { useBackgroundStore } from '../../background/state/backgroundStore';
import { useGreetingStore } from '../../greeting/state/greetingStore';
import { useUserNotificationsStore } from '../../notifications/state/userNotificationsStore';
import { useQuoteStore } from '../../quote/state/quoteStore';
import { useListsStore } from '../../tasks/state/listsStore';
import { useTagsStore } from '../../tasks/state/tagsStore';
import { useTeamsStore } from '../../teams/state/teamsStore';
import { websocketManager } from '../utils/WebsocketManager';

export type AppStore = {
  pingInterval: NodeJS.Timeout | null;
  userNotificationsCountInterval: NodeJS.Timeout | null;
  backgroundsInterval: NodeJS.Timeout | null;
  greetingsInterval: NodeJS.Timeout | null;
  quotesInterval: NodeJS.Timeout | null;
  reloadAppData: () => Promise<void>;
  reloadTheme: () => void;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  pingInterval: null,
  userNotificationsCountInterval: null,
  backgroundsInterval: null,
  greetingsInterval: null,
  quotesInterval: null,
  reloadAppData: async () => {
    const {
      reloadTheme,
      pingInterval,
      userNotificationsCountInterval,
      backgroundsInterval,
      greetingsInterval,
      quotesInterval,
    } = get();
    const { auth, doPing } = useAuthStore.getState();
    const { reloadUserLimitsAndUsage } = useUserLimitsAndUsageStore.getState();
    const { reloadLists, reloadTasksCountMap } = useListsStore.getState();
    const { reloadTags } = useTagsStore.getState();
    const { reloadBackgrounds, setRandomBackground } = useBackgroundStore.getState();
    const { reloadGreetings, setRandomGreeting } = useGreetingStore.getState();
    const { reloadQuotes, setRandomQuote } = useQuoteStore.getState();
    const { reloadJoinedTeam } = useTeamsStore.getState();
    const { reloadUnreadUserNotificationsCount } = useUserNotificationsStore.getState();

    if (pingInterval) {
      clearInterval(pingInterval);
    }

    if (userNotificationsCountInterval) {
      clearInterval(userNotificationsCountInterval);
    }

    if (backgroundsInterval) {
      clearInterval(backgroundsInterval);
    }

    if (greetingsInterval) {
      clearInterval(greetingsInterval);
    }

    if (quotesInterval) {
      clearInterval(quotesInterval);
    }

    if (!auth?.userAccessToken?.token) {
      return;
    }

    // User Limits and Usage
    reloadUserLimitsAndUsage();

    // Theme
    reloadTheme();

    // Team
    reloadJoinedTeam();

    // Tasks
    reloadLists();
    reloadTasksCountMap();
    reloadTags();

    // Websocket
    websocketManager.joinAndConnect();

    // Ping
    (async () => {
      await doPing();

      const pingInterval = setInterval(doPing, 1000 * 60);
      set({ pingInterval });
    })();

    // User Notifications
    (async () => {
      await reloadUnreadUserNotificationsCount();

      const userNotificationsCountInterval = setInterval(
        reloadUnreadUserNotificationsCount,
        1000 * 60 * 2
      );
      set({ userNotificationsCountInterval });
    })();

    // Backgrounds
    (async () => {
      await reloadBackgrounds();

      setRandomBackground();

      const backgroundsInterval = setInterval(setRandomBackground, 1000 * 60 * 2);
      set({ backgroundsInterval });
    })();

    // Greetings
    (async () => {
      await reloadGreetings();

      setRandomGreeting();

      const greetingsInterval = setInterval(setRandomGreeting, 1000 * 60 * 2);
      set({ greetingsInterval });
    })();

    // Quotes
    (async () => {
      await reloadQuotes();

      setRandomQuote();

      const quotesInterval = setInterval(setRandomQuote, 1000 * 60 * 2);
      set({ quotesInterval });
    })();
  },
  reloadTheme: () => {
    const { auth } = useAuthStore.getState();

    const isSystemDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (
      auth?.user?.settings?.generalTheme === ThemeEnum.DARK ||
      (auth?.user?.settings?.generalTheme === ThemeEnum.SYSTEM && isSystemDarkTheme)
    ) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  },
}));

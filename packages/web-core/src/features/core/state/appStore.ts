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
  reloadAppData: () => Promise<void>;
  reloadTheme: () => void;
};

export const useAppStore = create<AppStore>()((_, get) => ({
  reloadAppData: async () => {
    const { reloadTheme } = get();
    const { auth, doPing } = useAuthStore.getState();
    const { reloadUserLimitsAndUsage } = useUserLimitsAndUsageStore.getState();
    const { reloadLists, reloadTasksCountMap } = useListsStore.getState();
    const { reloadTags } = useTagsStore.getState();
    const { reloadBackgrounds, setRandomBackground } = useBackgroundStore.getState();
    const { reloadGreetings, setRandomGreeting } = useGreetingStore.getState();
    const { reloadQuotes, setRandomQuote } = useQuoteStore.getState();
    const { reloadJoinedTeam } = useTeamsStore.getState();
    const { reloadUnreadUserNotificationsCount } = useUserNotificationsStore.getState();

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
    websocketManager.init();

    // Ping
    (async () => {
      await doPing();

      setInterval(doPing, 1000 * 60);
    })();

    // User Notifications
    (async () => {
      await reloadUnreadUserNotificationsCount();

      setInterval(reloadUnreadUserNotificationsCount, 1000 * 60 * 2);
    })();

    // Backgrounds
    (async () => {
      await reloadBackgrounds();

      setRandomBackground();
      setInterval(setRandomBackground, 1000 * 60 * 2);
    })();

    // Greetings
    (async () => {
      await reloadGreetings();

      setRandomGreeting();
      setInterval(setRandomGreeting, 1000 * 60 * 2);
    })();

    // Quotes
    (async () => {
      await reloadQuotes();

      setRandomQuote();
      setTimeout(setRandomQuote, 1000 * 60 * 2);
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

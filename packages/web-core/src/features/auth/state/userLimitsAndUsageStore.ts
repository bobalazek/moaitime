import { create } from 'zustand';

import { UserLimits, UserUsage } from '@moaitime/shared-common';

import { getUserLimits, getUserUsage } from '../utils/AuthHelpers';

export type UserLimitsAndUsageStore = {
  userLimits: UserLimits | null;
  userUsage: UserUsage | null;
  reloadUserLimits: () => Promise<UserLimits | null>;
  reloadUserUsage: () => Promise<UserUsage | null>;
  reloadUserLimitsAndUsage: () => Promise<void>;
};

export const useUserLimitsAndUsageStore = create<UserLimitsAndUsageStore>()((set, get) => ({
  userLimits: null,
  userUsage: null,
  reloadUserLimits: async () => {
    const userLimits = await getUserLimits();

    set({
      userLimits,
    });

    return userLimits;
  },
  reloadUserUsage: async () => {
    const userUsage = await getUserUsage();

    set({
      userUsage,
    });

    return userUsage;
  },
  reloadUserLimitsAndUsage: async () => {
    const { reloadUserLimits, reloadUserUsage } = get();

    await reloadUserLimits();
    await reloadUserUsage();
  },
}));

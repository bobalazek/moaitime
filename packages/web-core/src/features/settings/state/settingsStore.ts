import { create } from 'zustand';

import { DEFAULT_USER_SETTINGS, UserSettingsInterface } from '@myzenbuddy/shared-common';

export type SettingsStore = {
  /********** General **********/
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  settings: UserSettingsInterface;
  updateSettings: (settings: Partial<UserSettingsInterface>) => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  /********** General **********/
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    set({
      dialogOpen,
    });
  },
  settings: DEFAULT_USER_SETTINGS,
  updateSettings: async (settings: Partial<UserSettingsInterface>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    }));
  },
}));

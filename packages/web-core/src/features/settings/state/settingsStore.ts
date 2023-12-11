import { create } from 'zustand';

import { DEFAULT_USER_SETTINGS, UserSettings } from '@myzenbuddy/shared-common';

export type SettingsStore = {
  /********** General **********/
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
};

// TODO: move that all into the auth store!!!

export const useSettingsStore = create<SettingsStore>()((set) => ({
  /********** General **********/
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    set({
      dialogOpen,
    });
  },
  settings: DEFAULT_USER_SETTINGS,
  updateSettings: async (settings: Partial<UserSettings>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    }));
  },
}));

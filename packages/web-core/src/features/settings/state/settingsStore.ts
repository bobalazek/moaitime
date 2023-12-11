import { create } from 'zustand';

import { DEFAULT_SETTINGS, SettingsInterface } from '@myzenbuddy/shared-common';

export type SettingsStore = {
  /********** General **********/
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  settings: SettingsInterface;
  updateSettings: (settings: Partial<SettingsInterface>) => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  /********** General **********/
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    set({
      dialogOpen,
    });
  },
  settings: DEFAULT_SETTINGS,
  updateSettings: async (settings: Partial<SettingsInterface>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    }));
  },
}));

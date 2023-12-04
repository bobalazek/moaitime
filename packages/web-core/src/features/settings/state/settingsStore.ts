import { create } from 'zustand';

import { defaultSettings, SettingsInterface } from '@myzenbuddy/shared-common';

export type SettingsStore = {
  /********** General **********/
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  settings: SettingsInterface;
  setSettings: (settings: SettingsInterface) => Promise<void>;
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
  settings: defaultSettings,
  setSettings: async (settings: SettingsInterface) => {
    set({ settings });
  },
  updateSettings: async (settings: Partial<SettingsInterface>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    }));
  },
}));

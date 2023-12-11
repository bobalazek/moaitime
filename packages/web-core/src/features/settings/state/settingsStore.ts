import { create } from 'zustand';

export type SettingsStore = {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    set({
      dialogOpen,
    });
  },
}));

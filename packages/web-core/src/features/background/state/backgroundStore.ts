import { create } from 'zustand';

import { BackgroundInterface } from '@myzenbuddy/shared-common';

export type BackgroundStore = {
  background: BackgroundInterface | null;
  setBackground: (background: BackgroundInterface | null) => Promise<void>;
};

export const useBackgroundStore = create<BackgroundStore>()((set) => ({
  background: null,
  setBackground: async (background: BackgroundInterface | null) => {
    set({ background });
  },
}));

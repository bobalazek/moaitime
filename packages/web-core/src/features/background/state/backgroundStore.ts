import { create } from 'zustand';

import { BackgroundInterface } from '@myzenbuddy/shared-common';

import { loadBackgrounds } from '../utils/BackgroundHelpers';

export type BackgroundStore = {
  background: BackgroundInterface | null;
  setBackground: (
    selectedBackground: BackgroundInterface | null
  ) => Promise<BackgroundInterface | null>;
  setRandomBackground: () => Promise<BackgroundInterface>;
  backgrounds: BackgroundInterface[];
  setBackgrounds: (backgrounds: BackgroundInterface[]) => Promise<BackgroundInterface[]>;
  loadBackgrounds: () => Promise<BackgroundInterface[]>;
};

export const useBackgroundStore = create<BackgroundStore>()((set, get) => ({
  background: null,
  setBackground: async (background: BackgroundInterface | null) => {
    set({ background });

    return background;
  },
  setRandomBackground: async () => {
    const { backgrounds, setBackground } = get();

    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)] ?? null;

    setBackground(randomBackground);

    return randomBackground;
  },
  backgrounds: [],
  setBackgrounds: async (backgrounds: BackgroundInterface[]) => {
    set({ backgrounds });

    return backgrounds;
  },
  loadBackgrounds: async () => {
    const response = await loadBackgrounds();
    const backgrounds = response.data ?? [];

    set({ backgrounds });

    return backgrounds;
  },
}));

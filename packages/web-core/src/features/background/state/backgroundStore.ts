import { create } from 'zustand';

import { BackgroundInterface } from '@moaitime/shared-common';

import { loadBackgrounds } from '../utils/BackgroundHelpers';

export type BackgroundStore = {
  background: BackgroundInterface | null;
  setBackground: (
    selectedBackground: BackgroundInterface | null
  ) => Promise<BackgroundInterface | null>;
  setRandomBackground: () => Promise<BackgroundInterface>;
  backgrounds: BackgroundInterface[];
  reloadBackgrounds: () => Promise<BackgroundInterface[]>;
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
  reloadBackgrounds: async () => {
    const backgrounds = await loadBackgrounds();

    set({ backgrounds });

    return backgrounds;
  },
}));

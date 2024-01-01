import { create } from 'zustand';

export type AppStore = {
  version?: string;
  setVersion: (version: string) => void;
};

export const useAppStore = create<AppStore>()((set) => ({
  version: undefined,
  setVersion: (version: string) => set({ version }),
}));

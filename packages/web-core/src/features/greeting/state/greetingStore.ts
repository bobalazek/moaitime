import { create } from 'zustand';

import { GreetingInterface } from '@moaitime/shared-common';

import { getGreetings } from '../utils/GreetingsHelpers';

export type GreetingStore = {
  greeting: GreetingInterface | null;
  setGreeting: (greeting: GreetingInterface | null) => Promise<GreetingInterface | null>;
  setRandomGreeting: () => Promise<GreetingInterface>;
  greetings: GreetingInterface[];
  reloadGreetings: () => Promise<GreetingInterface[]>;
};

export const useGreetingStore = create<GreetingStore>()((set, get) => ({
  greeting: null,
  setGreeting: async (greeting: GreetingInterface | null) => {
    set({ greeting });

    return greeting;
  },
  setRandomGreeting: async () => {
    const { greetings, setGreeting } = get();

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    setGreeting(greeting);

    return greeting;
  },
  greetings: [],
  reloadGreetings: async () => {
    const greetings = await getGreetings();

    set({ greetings });

    return greetings;
  },
}));

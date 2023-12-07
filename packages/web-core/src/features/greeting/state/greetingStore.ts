import { create } from 'zustand';

import { GreetingInterface } from '@myzenbuddy/shared-common';

import { queryEvaluator } from '../../core/utils/QueryEvaluatorHelpers';
import { loadGreetings } from '../utils/GreetingsHelpers';

export type GreetingStore = {
  greeting: GreetingInterface | null;
  setGreeting: (greeting: GreetingInterface | null) => Promise<GreetingInterface | null>;
  setRandomGreeting: () => Promise<GreetingInterface>;
  greetings: GreetingInterface[];
  setGreetings: (greetings: GreetingInterface[]) => Promise<GreetingInterface[]>;
  loadGreetings: () => Promise<GreetingInterface[]>;
};

export const useGreetingStore = create<GreetingStore>()((set, get) => ({
  greeting: null,
  setGreeting: async (greeting: GreetingInterface | null) => {
    set({ greeting });

    return greeting;
  },
  setRandomGreeting: async () => {
    const { greetings, setGreeting } = get();

    const suitableGreetings = greetings.filter((greeting) => {
      try {
        return greeting.query ? queryEvaluator(greeting.query) : true;
      } catch {
        return false;
      }
    });
    const greeting = suitableGreetings[Math.floor(Math.random() * suitableGreetings.length)];

    setGreeting(greeting);

    return greeting;
  },
  greetings: [],
  setGreetings: async (greetings: GreetingInterface[]) => {
    set({ greetings });

    return greetings;
  },
  loadGreetings: async () => {
    const response = await loadGreetings();
    const greetings = response.data ?? [];

    set({ greetings });

    return greetings;
  },
}));

import { create } from 'zustand';

import { GreetingInterface } from '@myzenbuddy/shared-common';

import { queryEvaluator } from '../../core/utils/QueryEvaluatorHelpers';

export type GreetingStore = {
  greeting: GreetingInterface | null;
  setGreeting: (greeting: GreetingInterface | null) => Promise<void>;
  setRandomGreeting: () => Promise<void>;
  greetings: GreetingInterface[];
  setGreetings: (greetings: GreetingInterface[]) => Promise<void>;
};

export const useGreetingStore = create<GreetingStore>()((set, get) => ({
  greeting: null,
  setGreeting: async (greeting: GreetingInterface | null) => {
    set({ greeting });
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
  },
  greetings: [],
  setGreetings: async (greetings: GreetingInterface[]) => {
    set({ greetings });
  },
}));

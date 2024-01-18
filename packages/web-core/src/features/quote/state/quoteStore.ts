import { create } from 'zustand';

import { QuoteInterface } from '@moaitime/shared-common';

import { getQuotes } from '../utils/QuotesHelpers';

export type QuoteStore = {
  quote: QuoteInterface | null;
  setQuote: (quote: QuoteInterface | null) => Promise<void>;
  setRandomQuote: () => Promise<void>;
  quotes: QuoteInterface[];
  reloadQuotes: () => Promise<QuoteInterface[]>;
};

export const useQuoteStore = create<QuoteStore>()((set, get) => ({
  quote: null,
  setQuote: async (quote: QuoteInterface | null) => {
    set({ quote });
  },
  setRandomQuote: async () => {
    const { quotes, setQuote } = get();

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    setQuote(randomQuote);
  },
  quotes: [],
  reloadQuotes: async () => {
    const quotes = await getQuotes();

    set({ quotes });

    return quotes;
  },
}));

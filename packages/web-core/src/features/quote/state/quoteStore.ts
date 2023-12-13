import { QuoteInterface } from '@moaitime/shared-common';
import { create } from 'zustand';

import { loadQuotes } from '../utils/QuotesHelpers';

export type QuoteStore = {
  quote: QuoteInterface | null;
  setQuote: (quote: QuoteInterface | null) => Promise<void>;
  setRandomQuote: () => Promise<void>;
  quotes: QuoteInterface[];
  loadQuotes: () => Promise<QuoteInterface[]>;
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
  loadQuotes: async () => {
    const response = await loadQuotes();
    const quotes = response.data ?? [];

    set({ quotes });

    return quotes;
  },
}));

import { create } from 'zustand';

import { CalendarEntry } from '@moaitime/shared-common';

export type CalendarHighlightedCalendarEntryStore = {
  highlightedCalendarEntry: CalendarEntry | null;
  setHighlightedCalendarEntry: (highlightedCalendarEntry: CalendarEntry | null) => void;
};

// The reason that is separate from the calendarStore is, that this will trigger often,
// once you hover over the calendar, which would cause a lot of unnecessary re-renders

export const useCalendarHighlightedCalendarEntryStore =
  create<CalendarHighlightedCalendarEntryStore>()((set) => ({
    highlightedCalendarEntry: null,
    setHighlightedCalendarEntry: (highlightedCalendarEntry: CalendarEntry | null) => {
      set({
        highlightedCalendarEntry,
      });
    },
  }));

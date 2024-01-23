import { atom } from 'jotai';

import { CalendarEntry } from '@moaitime/shared-common';

export const calendarEventIsResizingAtom = atom(false);

export const highlightedCalendarEntryAtom = atom<CalendarEntry | null>(null);

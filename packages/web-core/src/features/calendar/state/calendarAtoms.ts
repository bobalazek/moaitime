import { atom } from 'jotai';

import { CalendarEntry } from '@moaitime/shared-common';

export const calendarEventResizingAtom = atom<CalendarEntry | null>(null);

export const highlightedCalendarEntryAtom = atom<CalendarEntry | null>(null);

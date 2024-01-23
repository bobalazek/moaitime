import { atom } from 'jotai';

import { CalendarEntry } from '@moaitime/shared-common';

export const highlightedCalendarEntryAtom = atom<CalendarEntry | null>(null);

export const calendarEventResizingAtom = atom<CalendarEntry | null>(null);

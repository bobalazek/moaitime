import { atom } from 'jotai';

import { CalendarEntry } from '@moaitime/shared-common';

export const highlightedCalendarEntryAtom = atom<CalendarEntry | null>(null);

export const calendarEventResizingAtom = atom<CalendarEntry | null>(null);

// Not a typo again - first calendar is the feature and second calendar is the component name

export const calendarCalendarPopoverOpenAtom = atom<boolean>(false);

export const calendarCalendarDialogOpenAtom = atom<boolean>(false);

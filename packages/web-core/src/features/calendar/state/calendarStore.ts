import { addDays, areIntervalsOverlapping, eachDayOfInterval, format } from 'date-fns';
import { create } from 'zustand';

import {
  Calendar,
  CalendarEntry,
  CalendarViewEnum,
  CreateEvent,
  Event,
  UpdateEvent,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import {
  addEvent,
  deleteEvent,
  editEvent,
  getAgendaRange,
  getMonthRange,
  getWeekRange,
  getYearRange,
  loadCalendarEntries,
  loadCalendars,
} from '../utils/CalendarHelpers';

export type CalendarStore = {
  /********** General **********/
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  // Selected Date
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  // Selected View
  selectedView: CalendarViewEnum;
  setSelectedView: (selectedView: CalendarViewEnum) => void;
  // Selected Days
  selectedDays: Date[];
  reloadSelectedDays: () => Promise<void>;
  isTodayInSelectedDaysRange: boolean;
  /********** Calendars **********/
  calendars: Calendar[];
  loadCalendars: () => Promise<Calendar[]>;
  /********** Calendar Entries **********/
  calendarEntries: CalendarEntry[];
  loadCalendarEnries: () => Promise<CalendarEntry[]>;
  // Selected
  selectedCalendarEntryDialogOpen: boolean;
  selectedCalendarEntry: CalendarEntry | null;
  setSelectedCalendarEntryDialogOpen: (
    selectedCalendarEntryDialogOpen: boolean,
    selectedCalendarEntry?: CalendarEntry | null
  ) => void;
  // Highlighted
  highlightedCalendarEntry: CalendarEntry | null;
  setHighlightedCalendarEntry: (highlightedCalendarEntry: CalendarEntry | null) => void;
  /********** Events **********/
  addEvent: (event: CreateEvent) => Promise<Event>;
  editEvent: (eventId: string, event: UpdateEvent) => Promise<Event>;
  deleteEvent: (eventId: string) => Promise<Event>;
};

export const useCalendarStore = create<CalendarStore>()((set, get) => ({
  /********** General **********/
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    const { loadCalendars, reloadSelectedDays } = get();

    set({
      dialogOpen,
    });

    if (dialogOpen) {
      loadCalendars();
      reloadSelectedDays();
    }
  },
  // Selected Date
  selectedDate: new Date(),
  setSelectedDate: (selectedDate: Date) => {
    const { reloadSelectedDays } = get();

    set({
      selectedDate,
    });

    reloadSelectedDays();
  },
  // Selected View
  selectedView: CalendarViewEnum.MONTH,
  setSelectedView: (selectedView: CalendarViewEnum) => {
    const { reloadSelectedDays } = get();

    set({
      selectedView,
    });

    reloadSelectedDays();
  },
  // Selected Days
  selectedDays: [],
  reloadSelectedDays: async () => {
    const { selectedDate, selectedView, loadCalendarEnries } = get();
    const { auth } = useAuthStore.getState();

    const generalStartDayOfWeek = auth?.user?.settings?.generalStartDayOfWeek ?? 0;
    const now = new Date();

    let selectedDays = [selectedDate];
    if (selectedView === CalendarViewEnum.WEEK) {
      selectedDays = eachDayOfInterval(getWeekRange(selectedDate, generalStartDayOfWeek));
    } else if (selectedView === CalendarViewEnum.MONTH) {
      selectedDays = eachDayOfInterval(getMonthRange(selectedDate));
    } else if (selectedView === CalendarViewEnum.YEAR) {
      selectedDays = eachDayOfInterval(getYearRange(selectedDate));
    } else if (selectedView === CalendarViewEnum.AGENDA) {
      selectedDays = eachDayOfInterval(getAgendaRange(selectedDate));
    }

    const isTodayInSelectedDaysRange =
      selectedDays.length === 1
        ? selectedDays[0].toDateString() === now.toDateString()
        : areIntervalsOverlapping(
            {
              start: now,
              end: now,
            },
            {
              start: selectedDays[0],
              // We want to add 1 day to the end date to make sure the whole last day is included in the range
              end: addDays(selectedDays[selectedDays.length - 1], 1),
            }
          );

    set({
      selectedDays,
      isTodayInSelectedDaysRange,
    });

    await loadCalendarEnries();
  },
  isTodayInSelectedDaysRange: false,
  /********** Calendars **********/
  calendars: [],
  loadCalendars: async () => {
    const calendars = await loadCalendars();

    set({ calendars });

    return calendars;
  },
  /********** Calendar Entries **********/
  calendarEntries: [],
  loadCalendarEnries: async () => {
    const { selectedDays } = get();

    const from = selectedDays[0] ? format(selectedDays[0], 'yyyy-MM-dd') : undefined;
    const to = selectedDays[selectedDays.length - 1]
      ? format(selectedDays[selectedDays.length - 1], 'yyyy-MM-dd')
      : undefined;

    const response = await loadCalendarEntries(from, to);
    const calendarEntries = response.data ?? [];

    set({ calendarEntries });

    return calendarEntries;
  },
  // Selected
  selectedCalendarEntryDialogOpen: false,
  selectedCalendarEntry: null,
  setSelectedCalendarEntryDialogOpen: (
    selectedCalendarEntryDialogOpen: boolean,
    selectedCalendarEntry?: CalendarEntry | null
  ) => {
    set({
      selectedCalendarEntryDialogOpen,
      selectedCalendarEntry,
    });
  },
  // Highlighted
  highlightedCalendarEntry: null,
  setHighlightedCalendarEntry: (highlightedCalendarEntry: CalendarEntry | null) => {
    set({
      highlightedCalendarEntry,
    });
  },
  /********** Events **********/
  addEvent: async (event: CreateEvent) => {
    const { loadCalendarEnries } = get();

    const addedTask = await addEvent(event);

    await loadCalendarEnries();

    return addedTask;
  },
  editEvent: async (eventId: string, event: UpdateEvent) => {
    const { loadCalendarEnries } = get();

    const editedTask = await editEvent(eventId, event);

    await loadCalendarEnries();

    return editedTask;
  },
  deleteEvent: async (eventId: string) => {
    const { loadCalendarEnries } = get();

    const deletedTask = await deleteEvent(eventId);

    await loadCalendarEnries();

    return deletedTask;
  },
}));

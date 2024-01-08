import { addDays, areIntervalsOverlapping, eachDayOfInterval, format } from 'date-fns';
import { create } from 'zustand';

import {
  Calendar,
  CalendarEntry,
  CalendarEntryYearlyEntry,
  CalendarViewEnum,
  CreateCalendar,
  UpdateCalendar,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import {
  addCalendar,
  addVisibleCalendar,
  deleteCalendar,
  editCalendar,
  getAgendaRange,
  getMonthRange,
  getWeekRange,
  getYearRange,
  loadCalendarEntries,
  loadCalendarEntriesYearly,
  loadCalendars,
  loadDeletedCalendars,
  removeVisibleCalendar,
  undeleteCalendar,
} from '../utils/CalendarHelpers';

export type CalendarStore = {
  /********** General **********/
  // Selected Date
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  setSelectedDateAndView: (selectedDate: Date, selectedView: CalendarViewEnum) => void; // We need this so we prevent double reloads when calling each of those separately
  // Selected View
  selectedView: CalendarViewEnum;
  setSelectedView: (selectedView: CalendarViewEnum) => void;
  // Selected Days
  selectedDays: Date[];
  reloadSelectedDays: () => Promise<void>;
  isTodayInSelectedDaysRange: boolean;
  // Settings Sheet
  settingsSheetOpen: boolean;
  setSettingsSheetOpen: (settingsSheetOpen: boolean) => void;
  /********** Calendars **********/
  calendars: Calendar[];
  loadCalendars: () => Promise<Calendar[]>;
  addCalendar: (calendar: CreateCalendar) => Promise<Calendar>;
  editCalendar: (calendarId: string, calendar: UpdateCalendar) => Promise<Calendar>;
  deleteCalendar: (calendarId: string, isHardDelete?: boolean) => Promise<Calendar>;
  undeleteCalendar: (calendarId: string) => Promise<Calendar>;
  addVisibleCalendar: (calendarId: string) => Promise<void>;
  removeVisibleCalendar: (calendarId: string) => Promise<void>;
  // Selected
  selectedCalendarDialogOpen: boolean;
  selectedCalendar: Calendar | null;
  setSelectedCalendarDialogOpen: (
    selectedCalendarDialogOpen: boolean,
    selectedCalendar?: Calendar | null
  ) => void;
  // Deleted
  deletedCalendarsDialogOpen: boolean;
  setDeletedCalendarsDialogOpen: (deletedCalendarsDialogOpen: boolean) => void;
  deletedCalendars: Calendar[];
  loadDeletedCalendars: () => Promise<Calendar[]>;
  // Delete Alert Dialog
  calendarDeleteAlertDialogOpen: boolean;
  selectedCalendarDeleteAlertDialog: Calendar | null;
  setCalendarDeleteAlertDialogOpen: (
    calendarDeleteAlertDialogOpen: boolean,
    selectedCalendarDeleteAlertDialog?: Calendar | null
  ) => void;
  /********** Calendar Entries **********/
  calendarEntries: CalendarEntry[];
  loadCalendarEntries: () => Promise<CalendarEntry[]>;
  calendarEntriesYearly: CalendarEntryYearlyEntry[];
  loadCalendarEntriesYearly: () => Promise<CalendarEntryYearlyEntry[]>;
};

export const useCalendarStore = create<CalendarStore>()((set, get) => ({
  /********** General **********/
  // Selected Date
  selectedDate: new Date(),
  setSelectedDate: (selectedDate: Date) => {
    const { reloadSelectedDays } = get();

    set({
      selectedDate,
    });

    reloadSelectedDays();
  },
  setSelectedDateAndView: (selectedDate: Date, selectedView: CalendarViewEnum) => {
    const { reloadSelectedDays } = get();

    set({
      selectedDate,
      selectedView,
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
    const { selectedDate, selectedView, loadCalendarEntries } = get();
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

    await loadCalendarEntries();
  },
  isTodayInSelectedDaysRange: false,
  // Settings Sheet
  settingsSheetOpen: false,
  setSettingsSheetOpen: (settingsSheetOpen: boolean) => {
    set({
      settingsSheetOpen,
    });
  },
  /********** Calendars **********/
  calendars: [],
  loadCalendars: async () => {
    const calendars = await loadCalendars();

    set({ calendars });

    return calendars;
  },
  addCalendar: async (calendar: CreateCalendar) => {
    const { loadCalendars, loadCalendarEntries } = get();

    const addedTask = await addCalendar(calendar);

    await loadCalendars();
    await loadCalendarEntries();

    // We update the settings, so we need to refresh the account
    await useAuthStore.getState().loadAccount();

    return addedTask;
  },
  editCalendar: async (calendarId: string, calendar: UpdateCalendar) => {
    const { loadCalendars, loadCalendarEntries } = get();

    const editedTask = await editCalendar(calendarId, calendar);

    await loadCalendars();
    await loadCalendarEntries();

    return editedTask;
  },
  deleteCalendar: async (calendarId: string, isHardDelete?: boolean) => {
    const { loadCalendars, loadCalendarEntries, loadDeletedCalendars, deletedCalendarsDialogOpen } =
      get();
    const { loadAccount } = useAuthStore.getState();

    const deletedTask = await deleteCalendar(calendarId, isHardDelete);

    await loadCalendars();
    await loadCalendarEntries();

    // Same as above
    await loadAccount();

    if (deletedCalendarsDialogOpen) {
      await loadDeletedCalendars();
    }

    return deletedTask;
  },
  undeleteCalendar: async (calendarId: string) => {
    const { loadCalendars, loadCalendarEntries, loadDeletedCalendars, deletedCalendarsDialogOpen } =
      get();
    const { loadAccount } = useAuthStore.getState();

    const undeletedTask = await undeleteCalendar(calendarId);

    await loadCalendars();
    await loadCalendarEntries();

    // Same as above
    await loadAccount();

    if (deletedCalendarsDialogOpen) {
      await loadDeletedCalendars();
    }

    return undeletedTask;
  },
  addVisibleCalendar: async (calendarId: string) => {
    const { loadCalendarEntries } = get();
    const { loadAccount } = useAuthStore.getState();

    await addVisibleCalendar(calendarId);

    // We update the settings, so we need to refresh the account
    await loadAccount();

    await loadCalendarEntries();
  },
  removeVisibleCalendar: async (calendarId: string) => {
    const { loadCalendarEntries } = get();
    const { loadAccount } = useAuthStore.getState();

    await removeVisibleCalendar(calendarId);

    // Same as above
    await loadAccount();

    await loadCalendarEntries();
  },
  // Selected
  selectedCalendarDialogOpen: false,
  selectedCalendar: null,
  setSelectedCalendarDialogOpen: (
    selectedCalendarDialogOpen: boolean,
    selectedCalendar?: Calendar | null
  ) => {
    set({
      selectedCalendarDialogOpen,
      selectedCalendar,
    });
  },
  // Deleted
  deletedCalendarsDialogOpen: false,
  setDeletedCalendarsDialogOpen: (deletedCalendarsDialogOpen: boolean) => {
    const { loadDeletedCalendars } = get();

    if (deletedCalendarsDialogOpen) {
      loadDeletedCalendars();
    }

    set({
      deletedCalendarsDialogOpen,
    });
  },
  deletedCalendars: [],
  loadDeletedCalendars: async () => {
    const deletedCalendars = await loadDeletedCalendars();

    set({ deletedCalendars });

    return deletedCalendars;
  },
  // Delete Alert Dialog
  calendarDeleteAlertDialogOpen: false,
  selectedCalendarDeleteAlertDialog: null,
  setCalendarDeleteAlertDialogOpen: (
    calendarDeleteAlertDialogOpen: boolean,
    selectedCalendarDeleteAlertDialog?: Calendar | null
  ) => {
    set({
      calendarDeleteAlertDialogOpen,
      selectedCalendarDeleteAlertDialog,
    });
  },
  /********** Calendar Entries **********/
  calendarEntries: [],
  loadCalendarEntries: async () => {
    const { selectedDays, selectedView, loadCalendarEntriesYearly } = get();

    if (selectedView === CalendarViewEnum.YEAR) {
      await loadCalendarEntriesYearly();

      return [];
    }

    const from = selectedDays[0] ? format(selectedDays[0], 'yyyy-MM-dd') : undefined;
    const to = selectedDays[selectedDays.length - 1]
      ? format(selectedDays[selectedDays.length - 1], 'yyyy-MM-dd')
      : undefined;

    const calendarEntries = await loadCalendarEntries(from, to);

    set({ calendarEntries });

    return calendarEntries;
  },
  calendarEntriesYearly: [],
  loadCalendarEntriesYearly: async () => {
    const { selectedDate } = get();

    const year = selectedDate.getFullYear();

    const response = await loadCalendarEntriesYearly(year);
    const calendarEntriesYearly = response.data ?? [];

    set({ calendarEntriesYearly });

    return calendarEntriesYearly;
  },
}));

import { addDays, areIntervalsOverlapping, eachDayOfInterval, format } from 'date-fns';
import { create } from 'zustand';

import {
  Calendar,
  CalendarEntry,
  CalendarEntryYearlyEntry,
  CalendarViewEnum,
  CreateCalendar,
  CreateUserCalendar,
  UpdateCalendar,
  UpdateUserCalendar,
  UserCalendar,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import {
  addCalendar,
  addUserCalendar,
  addVisibleCalendar,
  deleteCalendar,
  deleteUserCalendar,
  editCalendar,
  getAgendaRange,
  getCalendarEntries,
  getCalendarEntriesYearly,
  getCalendars,
  getDeletedCalendars,
  getMonthRange,
  getPublicCalendars,
  getUserCalendars,
  getWeekRange,
  getYearRange,
  removeVisibleCalendar,
  undeleteCalendar,
  updateUserCalendar,
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
  reloadCalendars: () => Promise<Calendar[]>;
  addCalendar: (calendar: CreateCalendar) => Promise<Calendar>;
  editCalendar: (calendarId: string, calendar: UpdateCalendar) => Promise<Calendar>;
  deleteCalendar: (calendarId: string, isHardDelete?: boolean) => Promise<Calendar>;
  undeleteCalendar: (calendarId: string) => Promise<Calendar>;
  addVisibleCalendar: (calendarId: string) => Promise<void>;
  removeVisibleCalendar: (calendarId: string) => Promise<void>;
  // User Calendars
  userCalendars: UserCalendar[];
  reloadUserCalendars: () => Promise<UserCalendar[]>;
  addUserCalendar: (userCalendar: CreateUserCalendar) => Promise<UserCalendar>;
  deleteUserCalendar: (userCalendarId: string) => Promise<UserCalendar>;
  updateUserCalendar: (
    userCalendarId: string,
    userCalendar: UpdateUserCalendar
  ) => Promise<UserCalendar>;
  // User Calendar
  selectedUserCalendarDialogOpen: boolean;
  selectedUserCalendar: UserCalendar | null;
  setSelectedUserCalendarDialogOpen: (
    selectedUserCalendarDialogOpen: boolean,
    selectedUserCalendar?: UserCalendar | null
  ) => void;
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
  reloadDeletedCalendars: () => Promise<Calendar[]>;
  // Delete Alert Dialog
  calendarDeleteAlertDialogOpen: boolean;
  selectedCalendarDeleteAlertDialog: Calendar | null;
  setCalendarDeleteAlertDialogOpen: (
    calendarDeleteAlertDialogOpen: boolean,
    selectedCalendarDeleteAlertDialog?: Calendar | null
  ) => void;
  // Public
  publicCalendarsDialogOpen: boolean;
  setPublicCalendarsDialogOpen: (publicCalendarsDialogOpen: boolean) => void;
  publicCalendars: Calendar[];
  reloadPublicCalendars: () => Promise<Calendar[]>;
  /********** Calendar Entries **********/
  calendarEntries: CalendarEntry[];
  reloadCalendarEntries: () => Promise<CalendarEntry[]>;
  calendarEntriesYearly: CalendarEntryYearlyEntry[];
  reloadCalendarEntriesYearly: () => Promise<CalendarEntryYearlyEntry[]>;
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
    const { selectedDate, selectedView, reloadCalendarEntries } = get();
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

    await reloadCalendarEntries();
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
  reloadCalendars: async () => {
    const calendars = await getCalendars();

    set({ calendars });

    return calendars;
  },
  addCalendar: async (calendar: CreateCalendar) => {
    const { reloadCalendars } = get();

    const addedTask = await addCalendar(calendar);

    await reloadCalendars();
    await getCalendarEntries();

    // We update the settings, so we need to refresh the account
    await useAuthStore.getState().reloadAccount();

    return addedTask;
  },
  editCalendar: async (calendarId: string, calendar: UpdateCalendar) => {
    const { reloadCalendars, reloadCalendarEntries } = get();

    const editedTask = await editCalendar(calendarId, calendar);

    await reloadCalendars();
    await reloadCalendarEntries();

    return editedTask;
  },
  deleteCalendar: async (calendarId: string, isHardDelete?: boolean) => {
    const {
      reloadCalendars,
      reloadCalendarEntries,
      reloadDeletedCalendars,
      deletedCalendarsDialogOpen,
    } = get();
    const { reloadAccount } = useAuthStore.getState();

    const deletedTask = await deleteCalendar(calendarId, isHardDelete);

    await reloadCalendars();
    await reloadCalendarEntries();

    await reloadAccount();

    if (deletedCalendarsDialogOpen) {
      await reloadDeletedCalendars();
    }

    return deletedTask;
  },
  undeleteCalendar: async (calendarId: string) => {
    const {
      reloadCalendars,
      reloadCalendarEntries,
      reloadDeletedCalendars,
      deletedCalendarsDialogOpen,
    } = get();
    const { reloadAccount } = useAuthStore.getState();

    const undeletedTask = await undeleteCalendar(calendarId);

    await reloadCalendars();
    await reloadCalendarEntries();

    await reloadAccount();

    if (deletedCalendarsDialogOpen) {
      await reloadDeletedCalendars();
    }

    return undeletedTask;
  },
  addVisibleCalendar: async (calendarId: string) => {
    const { reloadCalendarEntries } = get();
    const { reloadAccount } = useAuthStore.getState();

    await addVisibleCalendar(calendarId);

    await reloadAccount();

    await reloadCalendarEntries();
  },
  removeVisibleCalendar: async (calendarId: string) => {
    const { reloadCalendarEntries } = get();
    const { reloadAccount } = useAuthStore.getState();

    await removeVisibleCalendar(calendarId);

    await reloadAccount();

    await reloadCalendarEntries();
  },
  // Shared
  userCalendars: [],
  reloadUserCalendars: async () => {
    const userCalendars = await getUserCalendars();

    set({ userCalendars });

    return userCalendars;
  },
  addUserCalendar: async (userCalendar: CreateUserCalendar) => {
    const { reloadCalendarEntries, reloadUserCalendars } = get();
    const { reloadAccount } = useAuthStore.getState();

    const addedUserCalendar = await addUserCalendar(userCalendar);

    await reloadUserCalendars();

    await reloadAccount();

    await reloadCalendarEntries();

    return addedUserCalendar;
  },
  deleteUserCalendar: async (userCalendarId: string) => {
    const { reloadCalendarEntries, reloadUserCalendars } = get();
    const { reloadAccount } = useAuthStore.getState();

    const removedUserCalendar = await deleteUserCalendar(userCalendarId);

    await reloadUserCalendars();

    await reloadAccount();

    await reloadCalendarEntries();

    return removedUserCalendar;
  },
  updateUserCalendar: async (calendarId: string, userCalendar: UpdateUserCalendar) => {
    const { reloadUserCalendars } = get();

    const editedTask = await updateUserCalendar(calendarId, userCalendar);

    await reloadUserCalendars();

    return editedTask;
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
  // User Calendar
  selectedUserCalendarDialogOpen: false,
  selectedUserCalendar: null,
  setSelectedUserCalendarDialogOpen: (
    selectedUserCalendarDialogOpen: boolean,
    selectedUserCalendar?: UserCalendar | null
  ) => {
    set({
      selectedUserCalendarDialogOpen,
      selectedUserCalendar,
    });
  },
  // Deleted
  deletedCalendarsDialogOpen: false,
  setDeletedCalendarsDialogOpen: (deletedCalendarsDialogOpen: boolean) => {
    const { reloadDeletedCalendars } = get();

    if (deletedCalendarsDialogOpen) {
      reloadDeletedCalendars();
    }

    set({
      deletedCalendarsDialogOpen,
    });
  },
  deletedCalendars: [],
  reloadDeletedCalendars: async () => {
    const deletedCalendars = await getDeletedCalendars();

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
  // Public
  publicCalendarsDialogOpen: false,
  setPublicCalendarsDialogOpen: (publicCalendarsDialogOpen: boolean) => {
    const { reloadPublicCalendars } = get();

    if (publicCalendarsDialogOpen) {
      reloadPublicCalendars();
    }

    set({
      publicCalendarsDialogOpen,
    });
  },
  publicCalendars: [],
  reloadPublicCalendars: async () => {
    const publicCalendars = await getPublicCalendars();

    set({ publicCalendars });

    return publicCalendars;
  },
  /********** Calendar Entries **********/
  calendarEntries: [],
  reloadCalendarEntries: async () => {
    const { selectedDays, selectedView, reloadCalendarEntriesYearly } = get();

    if (selectedView === CalendarViewEnum.YEAR) {
      await reloadCalendarEntriesYearly();

      return [];
    }

    const from = selectedDays[0] ? format(selectedDays[0], 'yyyy-MM-dd') : undefined;
    const to = selectedDays[selectedDays.length - 1]
      ? format(selectedDays[selectedDays.length - 1], 'yyyy-MM-dd')
      : undefined;

    const calendarEntries = await getCalendarEntries(from, to);

    set({ calendarEntries });

    return calendarEntries;
  },
  calendarEntriesYearly: [],
  reloadCalendarEntriesYearly: async () => {
    const { selectedDate } = get();

    const year = selectedDate.getFullYear();

    const response = await getCalendarEntriesYearly(year);
    const calendarEntriesYearly = response.data ?? [];

    set({ calendarEntriesYearly });

    return calendarEntriesYearly;
  },
}));

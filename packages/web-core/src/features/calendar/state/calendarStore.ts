import { addDays, areIntervalsOverlapping, eachDayOfInterval, format } from 'date-fns';
import { debounce } from 'lodash';
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
import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';
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
  getWeeksForMonth,
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
  // Settings Dialog
  settingsDialogOpen: boolean;
  setSettingsDialogOpen: (settingsDialogOpen: boolean) => void;
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
  selectedCalendarDialog: Calendar | null;
  setSelectedCalendarDialogOpen: (
    selectedCalendarDialogOpen: boolean,
    selectedCalendarDialog?: Calendar | null
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
  calendarEntriesYearly: CalendarEntryYearlyEntry[];
  updateCalendarEntry: (calendarEntry: CalendarEntry) => void;
  reloadCalendarEntries: () => Promise<CalendarEntry[]>;
  reloadCalendarEntriesYearly: () => Promise<CalendarEntryYearlyEntry[]>;
  reloadCalendarEntriesDebounced: () => Promise<void>;
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
    const { selectedDate, selectedView, reloadCalendarEntriesDebounced } = get();
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

    await reloadCalendarEntriesDebounced();
  },
  isTodayInSelectedDaysRange: false,
  // Settings Dialog
  settingsDialogOpen: false,
  setSettingsDialogOpen: (settingsDialogOpen: boolean) => {
    set({
      settingsDialogOpen,
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
    const { reloadCalendars, reloadCalendarEntriesDebounced } = get();
    const { reloadAccount } = useAuthStore.getState();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const addedTask = await addCalendar(calendar);

    await reloadCalendars();
    await reloadCalendarEntriesDebounced();
    await reloadAccount();
    await reloadUserUsage();

    return addedTask;
  },
  editCalendar: async (calendarId: string, calendar: UpdateCalendar) => {
    const { reloadCalendars, reloadCalendarEntriesDebounced } = get();

    const editedTask = await editCalendar(calendarId, calendar);

    await reloadCalendars();
    await reloadCalendarEntriesDebounced();

    return editedTask;
  },
  deleteCalendar: async (calendarId: string, isHardDelete?: boolean) => {
    const {
      reloadCalendars,
      reloadCalendarEntriesDebounced,
      reloadDeletedCalendars,
      deletedCalendarsDialogOpen,
    } = get();
    const { reloadAccount } = useAuthStore.getState();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const deletedTask = await deleteCalendar(calendarId, isHardDelete);

    await reloadCalendars();
    await reloadCalendarEntriesDebounced();
    await reloadAccount();
    await reloadUserUsage();

    if (deletedCalendarsDialogOpen) {
      await reloadDeletedCalendars();
    }

    return deletedTask;
  },
  undeleteCalendar: async (calendarId: string) => {
    const {
      reloadCalendars,
      reloadCalendarEntriesDebounced,
      reloadDeletedCalendars,
      deletedCalendarsDialogOpen,
    } = get();
    const { reloadAccount } = useAuthStore.getState();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const undeletedTask = await undeleteCalendar(calendarId);

    await reloadCalendars();
    await reloadCalendarEntriesDebounced();
    await reloadAccount();
    await reloadUserUsage();

    if (deletedCalendarsDialogOpen) {
      await reloadDeletedCalendars();
    }

    return undeletedTask;
  },
  addVisibleCalendar: async (calendarId: string) => {
    const { reloadCalendarEntriesDebounced } = get();
    const { reloadAccount } = useAuthStore.getState();

    await addVisibleCalendar(calendarId);

    await reloadAccount();
    await reloadCalendarEntriesDebounced();
  },
  removeVisibleCalendar: async (calendarId: string) => {
    const { reloadCalendarEntriesDebounced } = get();
    const { reloadAccount } = useAuthStore.getState();

    await removeVisibleCalendar(calendarId);

    await reloadAccount();
    await reloadCalendarEntriesDebounced();
  },
  // Shared
  userCalendars: [],
  reloadUserCalendars: async () => {
    const userCalendars = await getUserCalendars();

    set({ userCalendars });

    return userCalendars;
  },
  addUserCalendar: async (userCalendar: CreateUserCalendar) => {
    const { reloadCalendarEntriesDebounced, reloadUserCalendars } = get();
    const { reloadAccount } = useAuthStore.getState();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const addedUserCalendar = await addUserCalendar(userCalendar);

    await reloadUserCalendars();
    await reloadAccount();
    await reloadCalendarEntriesDebounced();
    await reloadUserUsage();

    return addedUserCalendar;
  },
  deleteUserCalendar: async (userCalendarId: string) => {
    const { reloadCalendarEntriesDebounced, reloadUserCalendars } = get();
    const { reloadAccount } = useAuthStore.getState();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const removedUserCalendar = await deleteUserCalendar(userCalendarId);

    await reloadUserCalendars();
    await reloadAccount();
    await reloadCalendarEntriesDebounced();
    await reloadUserUsage();

    return removedUserCalendar;
  },
  updateUserCalendar: async (calendarId: string, userCalendar: UpdateUserCalendar) => {
    const { reloadCalendarEntriesDebounced, reloadUserCalendars } = get();

    const editedTask = await updateUserCalendar(calendarId, userCalendar);

    await reloadUserCalendars();
    await reloadCalendarEntriesDebounced();

    return editedTask;
  },
  // Selected
  selectedCalendarDialogOpen: false,
  selectedCalendarDialog: null,
  setSelectedCalendarDialogOpen: (
    selectedCalendarDialogOpen: boolean,
    selectedCalendarDialog?: Calendar | null
  ) => {
    set({
      selectedCalendarDialogOpen,
      selectedCalendarDialog,
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
  calendarEntriesYearly: [],
  updateCalendarEntry: (calendarEntry: CalendarEntry) => {
    const { calendarEntries } = get();

    const updatedCalendarEntries = calendarEntries.map((entry) => {
      if (entry.id === calendarEntry.id) {
        return calendarEntry;
      }

      return entry;
    });

    set({
      calendarEntries: updatedCalendarEntries,
    });
  },
  reloadCalendarEntries: async () => {
    const { auth } = useAuthStore.getState();
    const { selectedDate, selectedDays, selectedView, reloadCalendarEntriesYearly } = get();

    if (selectedView === CalendarViewEnum.YEAR) {
      await reloadCalendarEntriesYearly();

      return [];
    }

    let from = selectedDays[0] ? format(selectedDays[0], 'yyyy-MM-dd') : undefined;
    let to = selectedDays[selectedDays.length - 1]
      ? format(selectedDays[selectedDays.length - 1], 'yyyy-MM-dd')
      : undefined;

    if (selectedView === CalendarViewEnum.MONTH) {
      // The reason we have a separate from and to for month is, that in the month view,
      // most of the months overflow from previous month and also to the next month.

      const generalStartDayOfWeek = auth?.user?.settings?.generalStartDayOfWeek ?? 0;
      const monthlyWeeksFlat = getWeeksForMonth(selectedDate, generalStartDayOfWeek).flat();

      from = format(monthlyWeeksFlat[0], 'yyyy-MM-dd');
      to = format(monthlyWeeksFlat[monthlyWeeksFlat.length - 1], 'yyyy-MM-dd');
    }

    const calendarEntries = await getCalendarEntries(from, to);

    set({
      calendarEntries,
    });

    return calendarEntries;
  },
  reloadCalendarEntriesYearly: async () => {
    const { selectedDate } = get();

    const year = selectedDate.getFullYear();

    const response = await getCalendarEntriesYearly(year);
    const calendarEntriesYearly = response.data ?? [];

    set({ calendarEntriesYearly });

    return calendarEntriesYearly;
  },
  reloadCalendarEntriesDebounced: (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let debouncedFn: any = null;

    return async () => {
      const { reloadCalendarEntries } = get();

      if (!debouncedFn) {
        debouncedFn = debounce(reloadCalendarEntries, 200);
      }

      debouncedFn();
    };
  })(),
}));

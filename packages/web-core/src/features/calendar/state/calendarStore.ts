import { addDays, areIntervalsOverlapping, eachDayOfInterval, format } from 'date-fns';
import { create } from 'zustand';

import { CalendarViewEnum, Event } from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { getMonthRange, getWeekRange, getYearRange, loadEvents } from '../utils/CalendarHelpers';

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
  /********** Events **********/
  events: Event[];
  loadEvents: () => Promise<Event[]>;
};

export const useCalendarStore = create<CalendarStore>()((set, get) => ({
  /********** General **********/
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    const { reloadSelectedDays } = get();

    set({
      dialogOpen,
    });

    if (!dialogOpen) {
      return;
    }

    reloadSelectedDays();
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
    const { selectedDate, selectedView, loadEvents } = get();
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

    await loadEvents();
  },
  isTodayInSelectedDaysRange: false,
  /********** Events **********/
  events: [],
  loadEvents: async () => {
    const { selectedDays } = get();

    const from = selectedDays[0] ? format(selectedDays[0], 'yyyy-MM-dd') : undefined;
    const to = selectedDays[selectedDays.length - 1]
      ? format(selectedDays[selectedDays.length - 1], 'yyyy-MM-dd')
      : undefined;

    const response = await loadEvents(from, to);
    const events = response.data ?? [];

    set({ events });

    return events;
  },
}));

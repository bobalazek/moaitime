import { addDays, areIntervalsOverlapping, eachDayOfInterval } from 'date-fns';
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
  reloadSelectedDays: () => void;
  isTodayInSelectedDaysRange: boolean;
  /********** Events **********/
  events: Event[];
  loadEvents: () => Promise<Event[]>;
};

export const useCalendarStore = create<CalendarStore>()((set, get) => ({
  /********** General **********/
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    const { reloadSelectedDays, loadEvents } = get();

    set({
      dialogOpen,
    });

    if (dialogOpen) {
      loadEvents();
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
  reloadSelectedDays: () => {
    const { selectedDate, selectedView } = get();
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
  },
  isTodayInSelectedDaysRange: false,
  /********** Events **********/
  events: [],
  loadEvents: async () => {
    const response = await loadEvents();
    const events = response.data ?? [];

    set({ events });

    return events;
  },
}));

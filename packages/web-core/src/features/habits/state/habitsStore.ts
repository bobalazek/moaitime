import { create } from 'zustand';

import { CreateHabit, Habit, HabitDailtEntry, UpdateHabit } from '@moaitime/shared-common';

import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';
import { queryClient } from '../../core/utils/FetchHelpers';
import { HABITS_DAILY_QUERY_KEY } from '../hooks/useHabitsDailyQuery';
import {
  addHabit,
  deleteHabit,
  editHabit,
  getHabit,
  getHabits,
  undeleteHabit,
  updateHabitDaily,
} from '../utils/HabitHelpers';

export type HabitsStore = {
  /********** Habits **********/
  // General
  habits: Habit[];
  reloadHabits: () => Promise<Habit[]>;
  getHabit: (habitId: string) => Promise<Habit | null>;
  addHabit: (Habit: CreateHabit) => Promise<Habit>;
  editHabit: (habitId: string, Habit: UpdateHabit) => Promise<Habit>;
  deleteHabit: (habitId: string, isHardDelete?: boolean) => Promise<Habit>;
  undeleteHabit: (habitId: string) => Promise<Habit>;
  updateHabitDaily: (habitId: string, date: string, amount: number) => Promise<HabitDailtEntry>;
  // Selected Date
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  // Settings Dialog
  settingsDialogOpen: boolean;
  setSettingsDialogOpen: (settingsDialogOpen: boolean) => void;
  // Selected Habit Dialog
  selectedHabitDialogOpen: boolean;
  selectedHabitDialog: Habit | null;
  setSelectedHabitDialogOpen: (
    selectedHabitDialogOpen: boolean,
    selectedHabitDialog?: Habit | null
  ) => void;
};

export const useHabitsStore = create<HabitsStore>()((set, get) => ({
  /********** Habits **********/
  // General
  habits: [],
  reloadHabits: async () => {
    const habits = await getHabits();

    set({
      habits,
    });

    return habits;
  },
  getHabit: async (habitId: string) => {
    const habit = await getHabit(habitId);

    return habit;
  },
  addHabit: async (Habit: CreateHabit) => {
    const { reloadHabits } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const newHabit = await addHabit(Habit);

    await reloadHabits();
    await reloadUserUsage();

    queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    return newHabit;
  },
  editHabit: async (habitId: string, Habit: UpdateHabit) => {
    const { reloadHabits } = get();
    const editedHabit = await editHabit(habitId, Habit);

    await reloadHabits();

    queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    return editedHabit;
  },
  deleteHabit: async (habitId: string, isHardDelete?: boolean) => {
    const { reloadHabits } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const deletedHabit = await deleteHabit(habitId, isHardDelete);

    await reloadHabits();
    await reloadUserUsage();

    queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    return deletedHabit;
  },
  undeleteHabit: async (habitId: string) => {
    const { reloadHabits } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const undeletedHabit = await undeleteHabit(habitId);

    await reloadHabits();
    await reloadUserUsage();

    queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    return undeletedHabit;
  },
  updateHabitDaily: async (habitId: string, date: string, amount: number) => {
    const habitDailyEntry = await updateHabitDaily(habitId, date, amount);

    await queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    return habitDailyEntry;
  },
  // Selected Date
  selectedDate: new Date(),
  setSelectedDate: (selectedDate: Date) => {
    set({
      selectedDate,
    });
  },
  // Settings Dialog
  settingsDialogOpen: false,
  setSettingsDialogOpen: (settingsDialogOpen: boolean) => {
    set({
      settingsDialogOpen,
    });
  },
  // Selected Habit Dialog
  selectedHabitDialogOpen: false,
  selectedHabitDialog: null,
  setSelectedHabitDialogOpen(selectedHabitDialogOpen: boolean, selectedHabitDialog?: Habit | null) {
    set({
      selectedHabitDialogOpen,
      selectedHabitDialog,
    });
  },
}));

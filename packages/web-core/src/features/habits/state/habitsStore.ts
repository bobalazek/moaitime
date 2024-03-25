import { create } from 'zustand';

import { CreateHabit, Habit, HabitDailyEntry, UpdateHabit } from '@moaitime/shared-common';

import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';
import { queryClient } from '../../core/utils/FetchHelpers';
import { HABITS_DAILY_QUERY_KEY } from '../hooks/useHabitsDailyQuery';
import {
  addHabit,
  deleteHabit,
  editHabit,
  getDeletedHabits,
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
  updateHabitDaily: (habitId: string, date: string, amount: number) => Promise<HabitDailyEntry>;
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
  // Deleted
  deletedHabitsDialogOpen: boolean;
  setDeletedHabitsDialogOpen: (deletedHabitsDialogOpen: boolean) => void;
  deletedHabits: Habit[];
  reloadDeletedHabits: () => Promise<Habit[]>;
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
    const { selectedDate, reloadHabits } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const newHabit = await addHabit(Habit);

    await reloadHabits();
    await reloadUserUsage();

    queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    // Most people will find it confusing that if we have a selected date in the past and a new habit is added,
    // the habit will not show up there, that's why, if we have a selected date in the past,
    // we will set the selected date to today
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (selectedDate < today) {
      set({
        selectedDate: today,
      });
    }

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
    const { reloadHabits, reloadDeletedHabits, deletedHabitsDialogOpen } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const deletedHabit = await deleteHabit(habitId, isHardDelete);

    await reloadHabits();
    await reloadUserUsage();

    if (deletedHabitsDialogOpen) {
      await reloadDeletedHabits();
    }

    queryClient.invalidateQueries({
      queryKey: [HABITS_DAILY_QUERY_KEY],
    });

    return deletedHabit;
  },
  undeleteHabit: async (habitId: string) => {
    const { reloadHabits, reloadDeletedHabits, deletedHabitsDialogOpen } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const undeletedHabit = await undeleteHabit(habitId);

    await reloadHabits();
    await reloadUserUsage();

    if (deletedHabitsDialogOpen) {
      await reloadDeletedHabits();
    }

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
  // Deleted
  deletedHabitsDialogOpen: false,
  setDeletedHabitsDialogOpen: (deletedHabitsDialogOpen: boolean) => {
    const { reloadDeletedHabits } = get();

    if (deletedHabitsDialogOpen) {
      reloadDeletedHabits();
    }

    set({
      deletedHabitsDialogOpen,
    });
  },
  deletedHabits: [],
  reloadDeletedHabits: async () => {
    const deletedHabits = await getDeletedHabits();

    set({
      deletedHabits,
    });

    return deletedHabits;
  },
}));

import { create } from 'zustand';

import { CreateHabit, Habit, UpdateHabit } from '@moaitime/shared-common';

import { queryClient } from '../../core/utils/FetchHelpers';
import { HABITS_QUERY_KEY } from '../hooks/useHabitsQuery';
import { addHabit, deleteHabit, editHabit, getHabit, undeleteHabit } from '../utils/HabitHelpers';

export type HabitsStore = {
  /********** Habits **********/
  // Selected Date
  selectedDate: Date;
  setSelectedDate: (selectedDate: Date) => void;
  // Actions
  getHabit: (habitId: string) => Promise<Habit | null>;
  addHabit: (Habit: CreateHabit) => Promise<Habit>;
  editHabit: (habitId: string, Habit: UpdateHabit) => Promise<Habit>;
  deleteHabit: (habitId: string, isHardDelete?: boolean) => Promise<Habit>;
  undeleteHabit: (habitId: string) => Promise<Habit>;
  // Selected Habit Dialog
  selectedHabitDialogOpen: boolean;
  selectedHabitDialog: Habit | null;
  setSelectedHabitDialogOpen: (
    selectedHabitDialogOpen: boolean,
    selectedHabitDialog?: Habit | null
  ) => void;
};

export const useHabitsStore = create<HabitsStore>()((set) => ({
  /********** Habits **********/
  // Selected Date
  selectedDate: new Date(),
  setSelectedDate: (selectedDate: Date) => {
    set({
      selectedDate,
    });
  },
  // Actions
  getHabit: async (habitId: string) => {
    const habit = await getHabit(habitId);

    return habit;
  },
  addHabit: async (Habit: CreateHabit) => {
    const newHabit = await addHabit(Habit);

    queryClient.invalidateQueries({
      queryKey: [HABITS_QUERY_KEY],
    });

    return newHabit;
  },
  editHabit: async (habitId: string, Habit: UpdateHabit) => {
    const editedHabit = await editHabit(habitId, Habit);

    queryClient.invalidateQueries({
      queryKey: [HABITS_QUERY_KEY],
    });

    return editedHabit;
  },
  deleteHabit: async (habitId: string, isHardDelete?: boolean) => {
    const deletedHabit = await deleteHabit(habitId, isHardDelete);

    queryClient.invalidateQueries({
      queryKey: [HABITS_QUERY_KEY],
    });

    return deletedHabit;
  },
  undeleteHabit: async (habitId: string) => {
    const undeletedHabit = await undeleteHabit(habitId);

    queryClient.invalidateQueries({
      queryKey: [HABITS_QUERY_KEY],
    });

    return undeletedHabit;
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

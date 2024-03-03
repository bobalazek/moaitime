import { create } from 'zustand';

import { CreateHabit, Habit, UpdateHabit } from '@moaitime/shared-common';

import { addHabit, deleteHabit, editHabit, getHabit, undeleteHabit } from '../utils/HabitHelpers';

export type HabitsStore = {
  /********** Habits **********/
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
  /********** Focus Sessions **********/
  getHabit: async (habitId: string) => {
    const habit = await getHabit(habitId);

    return habit;
  },
  addHabit: async (Habit: CreateHabit) => {
    const newHabit = await addHabit(Habit);

    return newHabit;
  },
  editHabit: async (habitId: string, Habit: UpdateHabit) => {
    const editedHabit = await editHabit(habitId, Habit);

    return editedHabit;
  },
  deleteHabit: async (habitId: string, isHardDelete?: boolean) => {
    const deletedHabit = await deleteHabit(habitId, isHardDelete);

    return deletedHabit;
  },
  undeleteHabit: async (habitId: string) => {
    const undeletedHabit = await undeleteHabit(habitId);

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

import { create } from 'zustand';

import { CreateGoal, GlobalEventsEnum, Goal, UpdateGoal } from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  addGoal,
  deleteGoal,
  editGoal,
  getDeletedGoals,
  getGoal,
  getGoals,
  reorderGoals,
  undeleteGoal,
} from '../utils/GoalHelpers';

export type GoalsStore = {
  /********** Goals **********/
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  reloadGoals: () => Promise<Goal[]>;
  getGoal: (goalId: string) => Promise<Goal>;
  addGoal: (data: CreateGoal) => Promise<Goal>;
  editGoal: (goalId: string, data: UpdateGoal) => Promise<Goal>;
  deleteGoal: (goalId: string, isHardDelete?: boolean) => Promise<Goal>;
  undeleteGoal: (goalId: string) => Promise<Goal>;
  reorderGoals: (originalGoalId: string, newGoalId: string) => Promise<void>;
  // Settings Dialog
  settingsDialogOpen: boolean;
  setSettingsDialogOpen: (settingsDialogOpen: boolean) => void;
  // Selected Goal Dialog
  selectedGoalDialogOpen: boolean;
  selectedGoalDialog: Goal | null;
  setSelectedGoalDialogOpen: (
    selectedGoalDialogOpen: boolean,
    selectedGoalDialog?: Goal | null
  ) => void;
  // Deleted
  deletedGoalsDialogOpen: boolean;
  setDeletedGoalsDialogOpen: (deletedGoalsDialogOpen: boolean) => void;
  deletedGoals: Goal[];
  reloadDeletedGoals: () => Promise<Goal[]>;
};

export const useGoalsStore = create<GoalsStore>()((set, get) => ({
  /********** Goals **********/
  goals: [],
  setGoals: (goals: Goal[]) => {
    set({
      goals,
    });
  },
  reloadGoals: async () => {
    const goals = await getGoals();

    set({
      goals,
    });

    return goals;
  },
  getGoal: async (goalId: string) => {
    const goal = await getGoal(goalId);

    return goal;
  },
  addGoal: async (data: CreateGoal) => {
    const { reloadGoals } = get();

    const addedGoal = await addGoal(data);

    await reloadGoals();

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_ADDED, {
      actorUserId: addedGoal.userId,
      goalId: addedGoal.id,
      goal: addedGoal,
    });

    return addedGoal;
  },
  editGoal: async (goalId: string, data: UpdateGoal) => {
    const { reloadGoals } = get();

    const editedGoal = await editGoal(goalId, data);

    await reloadGoals();

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_EDITED, {
      actorUserId: editedGoal.userId,
      goalId: editedGoal.id,
      goal: editedGoal,
    });

    return editedGoal;
  },
  deleteGoal: async (goalId: string, isHardDelete?: boolean) => {
    const { reloadGoals, reloadDeletedGoals, deletedGoalsDialogOpen } = get();

    const deletedGoal = await deleteGoal(goalId, isHardDelete);

    await reloadGoals();

    if (deletedGoalsDialogOpen) {
      await reloadDeletedGoals();
    }

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_DELETED, {
      actorUserId: deletedGoal.userId,
      goalId: deletedGoal.id,
      goal: deletedGoal,
      isHardDelete,
    });

    return deletedGoal;
  },
  undeleteGoal: async (goalId: string) => {
    const { reloadGoals } = get();

    const undeletedGoal = await undeleteGoal(goalId);

    await reloadGoals();

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_UNDELETED, {
      actorUserId: undeletedGoal.userId,
      goalId: undeletedGoal.id,
      goal: undeletedGoal,
    });

    return undeletedGoal;
  },
  reorderGoals: async (originalGoalId: string, newGoalId: string) => {
    const { reloadGoals } = get();

    await reorderGoals(originalGoalId, newGoalId);

    await reloadGoals();
  },
  // Settings Dialog
  settingsDialogOpen: false,
  setSettingsDialogOpen: (settingsDialogOpen: boolean) => {
    set({ settingsDialogOpen });
  },
  // Selected Goal Dialog
  selectedGoalDialogOpen: false,
  selectedGoalDialog: null,
  setSelectedGoalDialogOpen: (
    selectedGoalDialogOpen: boolean,
    selectedGoalDialog?: Goal | null
  ) => {
    set({
      selectedGoalDialogOpen,
      selectedGoalDialog,
    });
  },
  // Deleted
  deletedGoalsDialogOpen: false,
  setDeletedGoalsDialogOpen: (deletedGoalsDialogOpen: boolean) => {
    const { reloadDeletedGoals } = get();

    if (deletedGoalsDialogOpen) {
      reloadDeletedGoals();
    }

    set({
      deletedGoalsDialogOpen,
    });
  },
  deletedGoals: [],
  reloadDeletedGoals: async () => {
    const deletedGoals = await getDeletedGoals();

    set({
      deletedGoals,
    });

    return deletedGoals;
  },
}));

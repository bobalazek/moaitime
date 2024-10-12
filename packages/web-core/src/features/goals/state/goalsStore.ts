import { create } from 'zustand';

import { CreateGoal, GlobalEventsEnum, Goal, UpdateGoal } from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import { queryClient } from '../../core/utils/FetchHelpers';
import { GOALS_QUERY_KEY } from '../hooks/useGoalsDailyQuery';
import { addGoal, deleteGoal, editGoal, getGoal, undeleteGoal } from '../utils/GoalHelpers';

export type GoalsStore = {
  /********** Goals **********/
  getGoal: (goalId: string) => Promise<Goal>;
  addGoal: (data: CreateGoal) => Promise<Goal>;
  editGoal: (goalId: string, data: UpdateGoal) => Promise<Goal>;
  deleteGoal: (goalId: string, isHardDelete?: boolean) => Promise<Goal>;
  undeleteGoal: (goalId: string) => Promise<Goal>;
  // Selected Goal Dialog
  selectedGoalDialogOpen: boolean;
  selectedGoalDialog: Goal | null;
  setSelectedGoalDialogOpen: (
    selectedGoalDialogOpen: boolean,
    selectedGoalDialog?: Goal | null
  ) => void;
};

export const useGoalsStore = create<GoalsStore>()((set) => ({
  /********** Goals **********/
  getGoal: async (goalId: string) => {
    const goal = await getGoal(goalId);

    return goal;
  },
  addGoal: async (data: CreateGoal) => {
    const addedGoal = await addGoal(data);

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_ADDED, {
      actorUserId: addedGoal.userId,
      goalId: addedGoal.id,
      goal: addedGoal,
    });

    queryClient.invalidateQueries({
      queryKey: [GOALS_QUERY_KEY],
    });

    return addedGoal;
  },
  editGoal: async (goalId: string, data: UpdateGoal) => {
    const editedGoal = await editGoal(goalId, data);

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_EDITED, {
      actorUserId: editedGoal.userId,
      goalId: editedGoal.id,
      goal: editedGoal,
    });

    queryClient.invalidateQueries({
      queryKey: [GOALS_QUERY_KEY],
    });

    return editedGoal;
  },
  deleteGoal: async (goalId: string, isHardDelete?: boolean) => {
    const deletedGoal = await deleteGoal(goalId, isHardDelete);

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_DELETED, {
      actorUserId: deletedGoal.userId,
      goalId: deletedGoal.id,
      goal: deletedGoal,
      isHardDelete,
    });

    queryClient.invalidateQueries({
      queryKey: [GOALS_QUERY_KEY],
    });

    return deletedGoal;
  },
  undeleteGoal: async (goalId: string) => {
    const undeletedGoal = await undeleteGoal(goalId);

    globalEventsEmitter.emit(GlobalEventsEnum.GOALS_GOAL_UNDELETED, {
      actorUserId: undeletedGoal.userId,
      goalId: undeletedGoal.id,
      goal: undeletedGoal,
    });

    queryClient.invalidateQueries({
      queryKey: [GOALS_QUERY_KEY],
    });

    return undeletedGoal;
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
}));

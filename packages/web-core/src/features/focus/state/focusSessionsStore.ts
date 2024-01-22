import { create } from 'zustand';

import {
  CreateFocusSession,
  FocusSession,
  FocusSessionUpdateActionEnum,
  UpdateFocusSession,
} from '@moaitime/shared-common';

import {
  addFocusSession,
  deleteFocusSession,
  editFocusSession,
  getFocusSession,
  undeleteFocusSession,
  updateFocusSessionStatus,
} from '../utils/FocusSessionHelpers';

export type FocusSessionsStore = {
  /********** Focus Sessions **********/
  currentFocusSession: FocusSession | null;
  setCurrentFocusSession: (focusSession: FocusSession | null) => void;
  reloadCurrentFocusSession: () => Promise<FocusSession | null>;
  getFocusSession: (focusSessionId: string) => Promise<FocusSession | null>;
  addFocusSession: (focusSession: CreateFocusSession) => Promise<FocusSession>;
  editFocusSession: (
    focusSessionId: string,
    focusSession: UpdateFocusSession
  ) => Promise<FocusSession>;
  deleteFocusSession: (focusSessionId: string, isHardDelete?: boolean) => Promise<FocusSession>;
  undeleteFocusSession: (focusSessionId: string) => Promise<FocusSession>;
  updateFocusSessionStatus: (
    focusSessionId: string,
    action: FocusSessionUpdateActionEnum
  ) => Promise<FocusSession>;
  updateCurrentFocusSessionStatus: (action: FocusSessionUpdateActionEnum) => Promise<FocusSession>;
};

export const useFocusSessionsStore = create<FocusSessionsStore>()((set, get) => ({
  /********** Focus Sessions **********/
  currentFocusSession: null,
  setCurrentFocusSession: (focusSession: FocusSession | null) => {
    set({
      currentFocusSession: focusSession,
    });
  },
  reloadCurrentFocusSession: async () => {
    const currentFocusSession = await getFocusSession('current', true);

    set({
      currentFocusSession,
    });

    return currentFocusSession;
  },
  getFocusSession: async (focusSessionId: string) => {
    const focusSession = await getFocusSession(focusSessionId);

    return focusSession;
  },
  addFocusSession: async (focusSession: CreateFocusSession) => {
    const newFocusSession = await addFocusSession(focusSession);

    set({
      currentFocusSession: newFocusSession,
    });

    return newFocusSession;
  },
  editFocusSession: async (focusSessionId: string, focusSession: UpdateFocusSession) => {
    const { currentFocusSession } = get();

    const editedFocusSession = await editFocusSession(focusSessionId, focusSession);

    if (currentFocusSession?.id === focusSessionId) {
      set({
        currentFocusSession: editedFocusSession,
      });
    }

    return editedFocusSession;
  },
  deleteFocusSession: async (focusSessionId: string, isHardDelete?: boolean) => {
    const { currentFocusSession } = get();

    const deletedFocusSession = await deleteFocusSession(focusSessionId, isHardDelete);

    if (currentFocusSession?.id === focusSessionId) {
      set({
        currentFocusSession: null,
      });
    }

    return deletedFocusSession;
  },
  undeleteFocusSession: async (focusSessionId: string) => {
    const undeletedFocusSession = await undeleteFocusSession(focusSessionId);

    return undeletedFocusSession;
  },
  updateFocusSessionStatus: async (
    focusSessionId: string,
    action: FocusSessionUpdateActionEnum
  ) => {
    const updatedFocusSession = await updateFocusSessionStatus(focusSessionId, action);

    return updatedFocusSession;
  },
  updateCurrentFocusSessionStatus: async (action: FocusSessionUpdateActionEnum) => {
    const { currentFocusSession, updateFocusSessionStatus } = get();
    if (!currentFocusSession) {
      throw new Error('No current focus session found');
    }

    const updatedFocusSession = await updateFocusSessionStatus(currentFocusSession.id, action);

    set({
      currentFocusSession:
        action === FocusSessionUpdateActionEnum.COMPLETE ? null : updatedFocusSession,
    });

    return updatedFocusSession;
  },
}));

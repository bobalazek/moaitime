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
  activeFocusSession: FocusSession | null;
  reloadActiveFocusSession: () => Promise<FocusSession | null>;
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
  updateActiveFocusSessionStatus: (action: FocusSessionUpdateActionEnum) => Promise<FocusSession>;
};

export const useFocusSessionsStore = create<FocusSessionsStore>()((set, get) => ({
  /********** Focus Sessions **********/
  activeFocusSession: null,
  reloadActiveFocusSession: async () => {
    const activeFocusSession = await getFocusSession('active');

    set({
      activeFocusSession,
    });

    return activeFocusSession;
  },
  getFocusSession: async (focusSessionId: string) => {
    const focusSession = await getFocusSession(focusSessionId);

    return focusSession;
  },
  addFocusSession: async (focusSession: CreateFocusSession) => {
    const newFocusSession = await addFocusSession(focusSession);

    set({
      activeFocusSession: newFocusSession,
    });

    return newFocusSession;
  },
  editFocusSession: async (focusSessionId: string, focusSession: UpdateFocusSession) => {
    const { activeFocusSession } = get();

    const editedFocusSession = await editFocusSession(focusSessionId, focusSession);

    if (activeFocusSession?.id === focusSessionId) {
      set({
        activeFocusSession: editedFocusSession,
      });
    }

    return editedFocusSession;
  },
  deleteFocusSession: async (focusSessionId: string, isHardDelete?: boolean) => {
    const { activeFocusSession } = get();

    const deletedFocusSession = await deleteFocusSession(focusSessionId, isHardDelete);

    if (activeFocusSession?.id === focusSessionId) {
      set({
        activeFocusSession: null,
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
  updateActiveFocusSessionStatus: async (action: FocusSessionUpdateActionEnum) => {
    const { activeFocusSession, reloadActiveFocusSession } = get();
    if (!activeFocusSession) {
      throw new Error('No active focus session found');
    }

    const updatedFocusSession = await updateFocusSessionStatus(activeFocusSession.id, action);

    await reloadActiveFocusSession();

    return updatedFocusSession;
  },
}));

import { create } from 'zustand';

import { CreateFocusSession, FocusSession, UpdateFocusSession } from '@moaitime/shared-common';

import {
  addFocusSession,
  deleteFocusSession,
  editFocusSession,
  getFocusSession,
  undeleteFocusSession,
} from '../utils/FocusHelpers';

export type FocusStore = {
  /********** Focus **********/
  getFocusSession: (focusSessionId: string) => Promise<FocusSession>;
  addFocusSession: (focusSession: CreateFocusSession) => Promise<FocusSession>;
  editFocusSession: (
    focusSessionId: string,
    focusSession: UpdateFocusSession
  ) => Promise<FocusSession>;
  deleteFocusSession: (focusSessionId: string, isHardDelete?: boolean) => Promise<FocusSession>;
  undeleteFocusSession: (focusSessionId: string) => Promise<FocusSession>;
};

export const useFocusStore = create<FocusStore>()(() => ({
  /********** Focus **********/
  getFocusSession: async (focusSessionId: string) => {
    const focusSession = await getFocusSession(focusSessionId);

    return focusSession;
  },
  addFocusSession: async (focusSession: CreateFocusSession) => {
    const newFocusSession = await addFocusSession(focusSession);

    return newFocusSession;
  },
  editFocusSession: async (focusSessionId: string, focusSession: UpdateFocusSession) => {
    const editedFocusSession = await editFocusSession(focusSessionId, focusSession);

    return editedFocusSession;
  },
  deleteFocusSession: async (focusSessionId: string, isHardDelete?: boolean) => {
    const deletedFocusSession = await deleteFocusSession(focusSessionId, isHardDelete);

    return deletedFocusSession;
  },
  undeleteFocusSession: async (focusSessionId: string) => {
    const undeletedFocusSession = await undeleteFocusSession(focusSessionId);

    return undeletedFocusSession;
  },
}));

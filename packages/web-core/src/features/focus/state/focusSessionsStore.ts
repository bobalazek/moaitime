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
  triggerFocusSessionAction,
  undeleteFocusSession,
} from '../utils/FocusSessionHelpers';
import { focusSessionsEmitter, FocusSessionsEventsEnum } from './focusSessionsEmitter';

export type FocusSessionsStore = {
  /********** Focus Sessions **********/
  getFocusSession: (focusSessionId: string) => Promise<FocusSession | null>;
  addFocusSession: (focusSession: CreateFocusSession) => Promise<FocusSession>;
  editFocusSession: (
    focusSessionId: string,
    focusSession: UpdateFocusSession
  ) => Promise<FocusSession>;
  deleteFocusSession: (focusSessionId: string, isHardDelete?: boolean) => Promise<FocusSession>;
  undeleteFocusSession: (focusSessionId: string) => Promise<FocusSession>;
  triggerFocusSessionAction: (
    focusSessionId: string,
    action: FocusSessionUpdateActionEnum
  ) => Promise<FocusSession>;
  // Current
  currentFocusSession: FocusSession | null;
  setCurrentFocusSession: (focusSession: FocusSession | null) => void;
  reloadCurrentFocusSession: () => Promise<FocusSession | null>;
  triggerCurrentFocusSessionAction: (action: FocusSessionUpdateActionEnum) => Promise<FocusSession>;
};

export const useFocusSessionsStore = create<FocusSessionsStore>()((set, get) => ({
  /********** Focus Sessions **********/
  getFocusSession: async (focusSessionId: string) => {
    const focusSession = await getFocusSession(focusSessionId);

    return focusSession;
  },
  addFocusSession: async (focusSession: CreateFocusSession) => {
    const { setCurrentFocusSession } = get();

    const newFocusSession = await addFocusSession(focusSession);

    focusSessionsEmitter.emit(FocusSessionsEventsEnum.FOCUS_SESSION_ADDED, {
      focusSession: newFocusSession,
    });

    setCurrentFocusSession(newFocusSession);

    return newFocusSession;
  },
  editFocusSession: async (focusSessionId: string, focusSession: UpdateFocusSession) => {
    const { currentFocusSession, setCurrentFocusSession } = get();

    const editedFocusSession = await editFocusSession(focusSessionId, focusSession);

    focusSessionsEmitter.emit(FocusSessionsEventsEnum.FOCUS_SESSION_EDITED, {
      focusSession: editedFocusSession,
    });

    if (currentFocusSession?.id === focusSessionId) {
      setCurrentFocusSession(editedFocusSession);
    }

    return editedFocusSession;
  },
  deleteFocusSession: async (focusSessionId: string, isHardDelete?: boolean) => {
    const { currentFocusSession, setCurrentFocusSession } = get();

    const deletedFocusSession = await deleteFocusSession(focusSessionId, isHardDelete);

    focusSessionsEmitter.emit(FocusSessionsEventsEnum.FOCUS_SESSION_DELETED, {
      focusSession: deletedFocusSession,
      isHardDelete: !!isHardDelete,
    });

    if (currentFocusSession?.id === focusSessionId) {
      setCurrentFocusSession(null);
    }

    return deletedFocusSession;
  },
  undeleteFocusSession: async (focusSessionId: string) => {
    const undeletedFocusSession = await undeleteFocusSession(focusSessionId);

    focusSessionsEmitter.emit(FocusSessionsEventsEnum.FOCUS_SESSION_UNDELETED, {
      focusSession: undeletedFocusSession,
    });

    return undeletedFocusSession;
  },
  triggerFocusSessionAction: async (
    focusSessionId: string,
    action: FocusSessionUpdateActionEnum
  ) => {
    const updatedFocusSession = await triggerFocusSessionAction(focusSessionId, action);

    focusSessionsEmitter.emit(FocusSessionsEventsEnum.FOCUS_SESSION_ACTION_TRIGGERED, {
      focusSession: updatedFocusSession,
      action,
    });

    return updatedFocusSession;
  },
  // Current
  currentFocusSession: null,
  setCurrentFocusSession: (focusSession: FocusSession | null) => {
    const { currentFocusSession } = get();

    if (focusSession && currentFocusSession && focusSession.stage !== currentFocusSession.stage) {
      focusSessionsEmitter.emit(FocusSessionsEventsEnum.FOCUS_SESSION_CURRENT_STAGE_CHANGED, {
        focusSession,
        stage: focusSession.stage,
      });
    }

    set({
      currentFocusSession: focusSession,
    });
  },
  reloadCurrentFocusSession: async () => {
    const { setCurrentFocusSession } = get();

    const currentFocusSession = await getFocusSession('current', true);

    setCurrentFocusSession(currentFocusSession);

    return currentFocusSession;
  },
  triggerCurrentFocusSessionAction: async (action: FocusSessionUpdateActionEnum) => {
    const { currentFocusSession, setCurrentFocusSession, triggerFocusSessionAction } = get();
    if (!currentFocusSession) {
      throw new Error('No current focus session found');
    }

    const updatedFocusSession = await triggerFocusSessionAction(currentFocusSession.id, action);

    setCurrentFocusSession(
      action === FocusSessionUpdateActionEnum.COMPLETE ? null : updatedFocusSession
    );

    return updatedFocusSession;
  },
}));

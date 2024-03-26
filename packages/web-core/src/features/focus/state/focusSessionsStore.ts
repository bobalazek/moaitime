import { create } from 'zustand';

import {
  CreateFocusSession,
  FocusSession,
  FocusSessionUpdateActionEnum,
  GlobalEventsEnum,
  UpdateFocusSession,
} from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  addFocusSession,
  deleteFocusSession,
  editFocusSession,
  getFocusSession,
  triggerFocusSessionAction,
  undeleteFocusSession,
} from '../utils/FocusSessionHelpers';

export type FocusSessionsStore = {
  /********** Focus Sessions **********/
  getFocusSession: (focusSessionId: string) => Promise<FocusSession | null>;
  addFocusSession: (data: CreateFocusSession) => Promise<FocusSession>;
  editFocusSession: (focusSessionId: string, data: UpdateFocusSession) => Promise<FocusSession>;
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
  addFocusSession: async (data: CreateFocusSession) => {
    const { setCurrentFocusSession } = get();

    const newFocusSession = await addFocusSession(data);

    globalEventsEmitter.emit(GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED, {
      actorUserId: newFocusSession.userId,
      focusSessionId: newFocusSession.id,
      focusSession: newFocusSession,
    });

    setCurrentFocusSession(newFocusSession);

    return newFocusSession;
  },
  editFocusSession: async (focusSessionId: string, data: UpdateFocusSession) => {
    const { currentFocusSession, setCurrentFocusSession } = get();

    const editedFocusSession = await editFocusSession(focusSessionId, data);

    globalEventsEmitter.emit(GlobalEventsEnum.FOCUS_FOCUS_SESSION_EDITED, {
      actorUserId: editedFocusSession.userId,
      focusSessionId: editedFocusSession.id,
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

    globalEventsEmitter.emit(GlobalEventsEnum.FOCUS_FOCUS_SESSION_DELETED, {
      actorUserId: deletedFocusSession.userId,
      focusSessionId: deletedFocusSession.id,
      focusSession: deletedFocusSession,
      isHardDelete,
    });

    if (currentFocusSession?.id === focusSessionId) {
      setCurrentFocusSession(null);
    }

    return deletedFocusSession;
  },
  undeleteFocusSession: async (focusSessionId: string) => {
    const undeletedFocusSession = await undeleteFocusSession(focusSessionId);

    globalEventsEmitter.emit(GlobalEventsEnum.FOCUS_FOCUS_SESSION_UNDELETED, {
      actorUserId: undeletedFocusSession.userId,
      focusSessionId: undeletedFocusSession.id,
      focusSession: undeletedFocusSession,
    });

    return undeletedFocusSession;
  },
  triggerFocusSessionAction: async (
    focusSessionId: string,
    action: FocusSessionUpdateActionEnum
  ) => {
    const updatedFocusSession = await triggerFocusSessionAction(focusSessionId, action);

    globalEventsEmitter.emit(GlobalEventsEnum.FOCUS_FOCUS_SESSION_ACTION_TRIGGERED, {
      actorUserId: updatedFocusSession.userId,
      focusSessionId: updatedFocusSession.id,
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
      globalEventsEmitter.emit(GlobalEventsEnum.FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED, {
        actorUserId: focusSession.userId,
        focusSessionId: focusSession.id,
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

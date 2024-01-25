import mitt from 'mitt';

import {
  FocusSession,
  FocusSessionStageEnum,
  FocusSessionUpdateActionEnum,
} from '@moaitime/shared-common';

export enum FocusSessionsEventsEnum {
  FOCUS_SESSION_ADDED = 'focus:focus-session:added',
  FOCUS_SESSION_EDITED = 'focus:focus-session:edited',
  FOCUS_SESSION_DELETED = 'focus:focus-session:deleted',
  FOCUS_SESSION_UNDELETED = 'focus:focus-session:undeleted',
  FOCUS_SESSION_COMPLETED = 'focus:focus-session:completed',
  FOCUS_SESSION_ACTION_TRIGGERED = 'focus:focus-session:action-triggered',
  FOCUS_SESSION_CURRENT_STAGE_CHANGED = 'focus:focus-session:current-stage-changed',
}

export type FocusSessionsEmitterEvents = {
  [FocusSessionsEventsEnum.FOCUS_SESSION_ADDED]: { focusSession: FocusSession };
  [FocusSessionsEventsEnum.FOCUS_SESSION_EDITED]: { focusSession: FocusSession };
  [FocusSessionsEventsEnum.FOCUS_SESSION_DELETED]: {
    focusSession: FocusSession;
    isHardDelete: boolean;
  };
  [FocusSessionsEventsEnum.FOCUS_SESSION_UNDELETED]: { focusSession: FocusSession };
  [FocusSessionsEventsEnum.FOCUS_SESSION_COMPLETED]: { focusSession: FocusSession };
  [FocusSessionsEventsEnum.FOCUS_SESSION_ACTION_TRIGGERED]: {
    focusSession: FocusSession;
    action: FocusSessionUpdateActionEnum;
  };
  [FocusSessionsEventsEnum.FOCUS_SESSION_CURRENT_STAGE_CHANGED]: {
    focusSession: FocusSession;
    stage: FocusSessionStageEnum;
  };
};

export const focusSessionsEmitter = mitt<FocusSessionsEmitterEvents>();

import mitt from 'mitt';

import {
  FocusSession,
  FocusSessionStageEnum,
  FocusSessionUpdateActionEnum,
  GlobalEventsEnum,
} from '@moaitime/shared-common';

export type FocusSessionsEmitterEvents = {
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]: { focusSession: FocusSession };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_EDITED]: { focusSession: FocusSession };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_DELETED]: {
    focusSession: FocusSession;
    isHardDelete: boolean;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_UNDELETED]: { focusSession: FocusSession };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]: { focusSession: FocusSession };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ACTION_TRIGGERED]: {
    focusSession: FocusSession;
    action: FocusSessionUpdateActionEnum;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED]: {
    focusSession: FocusSession;
    stage: FocusSessionStageEnum;
  };
};

export const focusSessionsEmitter = mitt<FocusSessionsEmitterEvents>();

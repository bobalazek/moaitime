import mitt from 'mitt';

import {
  FocusSession,
  FocusSessionStageEnum,
  FocusSessionUpdateActionEnum,
  GlobalEventsEnum,
  MoodEntry,
  Task,
} from '@moaitime/shared-common';

export type GlobalEventsEmitterEvents = {
  // Tasks
  [GlobalEventsEnum.TASKS_TASK_ADDED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_EDITED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_DELETED]: { task: Task; isHardDelete: boolean };
  [GlobalEventsEnum.TASKS_TASK_UNDELETED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_UNCOMPLETED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_DUPLICATED]: { task: Task };
  // Mood
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: { moodEntry: MoodEntry };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED]: { moodEntry: MoodEntry };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED]: { moodEntry: MoodEntry; isHardDelete: boolean };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED]: { moodEntry: MoodEntry };
  // Focus
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

export const globalEventsEmitter = mitt<GlobalEventsEmitterEvents>();

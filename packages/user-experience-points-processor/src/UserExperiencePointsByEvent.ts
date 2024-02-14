import { EntityTypeEnum } from '../../shared-common/src/core/EntityTypeEnum';
import { GlobalEvents, GlobalEventsEnum } from '../../shared-common/src/core/GlobalEvents';

export const userExperiencePointsByEvent = {
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED]) => {
      return [`${EntityTypeEnum.TASKS}:${payload.taskId}`];
    },
  },
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: {
    amount: 10,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_COMPLETED]) => {
      return [`${EntityTypeEnum.TASKS}:${payload.taskId}`];
    },
  },
  [GlobalEventsEnum.CALENDAR_EVENT_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.CALENDAR_EVENT_ADDED]) => {
      return [`${EntityTypeEnum.EVENTS}:${payload.eventId}`];
    },
  },
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]) => {
      return [`${EntityTypeEnum.MOOD_ENTRIES}:${payload.moodEntryId}`];
    },
  },
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]) => {
      return [`${EntityTypeEnum.FOCUS_SESSIONS}:${payload.focusSessionId}`];
    },
  },
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]: {
    amount: 10,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]) => {
      return [`${EntityTypeEnum.FOCUS_SESSIONS}:${payload.focusSessionId}`];
    },
  },
};

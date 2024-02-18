import { EntityTypeEnum } from '../../shared-common/src/core/entities/EntityTypeEnum';
import { GlobalEvents, GlobalEventsEnum } from '../../shared-common/src/core/GlobalEvents';

export const userExperiencePointsByEvent = {
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED]) => {
      return [
        {
          id: payload.taskId,
          type: EntityTypeEnum.TASKS,
        },
      ];
    },
  },
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: {
    amount: 10,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_COMPLETED]) => {
      return [
        {
          id: payload.taskId,
          type: EntityTypeEnum.TASKS,
        },
      ];
    },
  },
  [GlobalEventsEnum.CALENDAR_EVENT_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.CALENDAR_EVENT_ADDED]) => {
      return [
        {
          id: payload.eventId,
          type: EntityTypeEnum.EVENTS,
        },
      ];
    },
  },
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]) => {
      return [
        {
          id: payload.moodEntryId,
          type: EntityTypeEnum.MOOD_ENTRIES,
        },
      ];
    },
  },
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]) => {
      return [
        {
          id: payload.focusSessionId,
          type: EntityTypeEnum.FOCUS_SESSIONS,
        },
      ];
    },
  },
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]: {
    amount: 10,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]) => {
      return [
        {
          id: payload.focusSessionId,
          type: EntityTypeEnum.FOCUS_SESSIONS,
        },
      ];
    },
  },
};

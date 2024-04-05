import { EntityTypeEnum } from '../../shared-common/src/core/entities/EntityTypeEnum';
import { GlobalEvents, GlobalEventsEnum } from '../../shared-common/src/core/GlobalEvents';

export const userExperiencePointsByEvent = {
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED]) => {
      return [
        {
          id: payload.taskId,
          type: EntityTypeEnum.TASK,
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
          type: EntityTypeEnum.TASK,
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
          type: EntityTypeEnum.EVENT,
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
          type: EntityTypeEnum.MOOD_ENTRY,
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
          type: EntityTypeEnum.FOCUS_SESSION,
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
          type: EntityTypeEnum.FOCUS_SESSION,
        },
      ];
    },
  },
};

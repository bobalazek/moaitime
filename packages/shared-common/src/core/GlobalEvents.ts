import { Calendar } from '../calendar/CalendarSchema';
import { Event } from '../calendar/EventSchema';
import { FocusSession } from '../focus/FocusSessionSchema';
import { FocusSessionStageEnum } from '../focus/FocusSessionStageEnum';
import { FocusSessionUpdateActionEnum } from '../focus/FocusSessionUpdateActionEnum';
import { MoodEntry } from '../mood/MoodEntrySchema';
import { List } from '../tasks/ListSchema';
import { Task } from '../tasks/TaskSchema';

export enum GlobalEventsEnum {
  // Tasks
  TASKS_TASK_ADDED = 'tasks:task:added',
  TASKS_TASK_EDITED = 'tasks:task:edited',
  TASKS_TASK_DELETED = 'tasks:task:deleted',
  TASKS_TASK_UNDELETED = 'tasks:task:undeleted',
  TASKS_TASK_COMPLETED = 'tasks:task:completed',
  TASKS_TASK_UNCOMPLETED = 'tasks:task:uncompleted',
  TASKS_TASK_DUPLICATED = 'tasks:task:duplicated',
  TASKS_TASK_ASSIGNED_TO_USER = 'tasks:task:assigned-to-user',
  TASKS_REORDERED = 'tasks:reordered',
  // Tasks - Lists
  TASKS_LIST_ADDED = 'tasks:list:added',
  TASKS_LIST_EDITED = 'tasks:list:edited',
  TASKS_LIST_DELETED = 'tasks:list:deleted',
  TASKS_LIST_ADD_VISIBLE = 'tasks:list:add-visible',
  TASKS_LIST_REMOVE_VISIBLE = 'tasks:list:remove-visible',
  // Calendar
  CALENDAR_CALENDAR_ADDED = 'calendar:calendar:added',
  CALENDAR_CALENDAR_EDITED = 'calendar:calendar:edited',
  CALENDAR_CALENDAR_DELETED = 'calendar:calendar:deleted',
  CALENDAR_CALENDAR_UNDELETED = 'calendar:calendar:undeleted',
  CALENDAR_CALENDAR_ADD_VISIBLE = 'calendar:calendar:add-visible',
  CALENDAR_CALENDAR_REMOVE_VISIBLE = 'calendar:calendar:remove-visible',
  // Calendar - Events
  CALENDAR_EVENT_ADDED = 'calendar:event:added',
  CALENDAR_EVENT_EDITED = 'calendar:event:edited',
  CALENDAR_EVENT_DELETED = 'calendar:event:deleted',
  CALENDAR_EVENT_UNDELETED = 'calendar:event:undeleted',
  // Focus
  FOCUS_FOCUS_SESSION_ADDED = 'focus:focus-session:added',
  FOCUS_FOCUS_SESSION_EDITED = 'focus:focus-session:edited',
  FOCUS_FOCUS_SESSION_DELETED = 'focus:focus-session:deleted',
  FOCUS_FOCUS_SESSION_UNDELETED = 'focus:focus-session:undeleted',
  FOCUS_FOCUS_SESSION_COMPLETED = 'focus:focus-session:completed',
  FOCUS_FOCUS_SESSION_ACTION_TRIGGERED = 'focus:focus-session:action-triggered',
  FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED = 'focus:focus-session:current-stage-changed',
  // Mood
  MOOD_MOOD_ENTRY_ADDED = 'mood:mood-entry:added',
  MOOD_MOOD_ENTRY_EDITED = 'mood:mood-entry:edited',
  MOOD_MOOD_ENTRY_DELETED = 'mood:mood-entry:deleted',
  MOOD_MOOD_ENTRY_UNDELETED = 'mood:mood-entry:undeleted',
  // Notifications
  NOTIFICATIONS_NOTIFICATION_MARKED_AS_READ = 'notifications:notification:marked-as-read',
  NOTIFICATIONS_NOTIFICATION_MARKED_AS_UNREAD = 'notifications:notification:marked-as-unread',
}

export type GlobalEvents = {
  // Tasks
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    userId: string; // Who did the action?
    taskId: string; // What task was added?
    listId?: string; // What list was the task added to?
    teamId?: string; // For what team was the task added (the teamId from the list)?
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_EDITED]: {
    userId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_DELETED]: {
    userId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    isHardDelete?: boolean;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_UNDELETED]: {
    userId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: {
    userId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_UNCOMPLETED]: {
    userId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_DUPLICATED]: {
    userId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER]: {
    userId: string; // Which user assigned it? Just so  we are consistent with the other events. The userId is the user that triggers the action
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    targetUserId: string; // To which user was it assigned?
  };
  [GlobalEventsEnum.TASKS_REORDERED]: {
    userId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
  };
  // Tasks - Lists
  [GlobalEventsEnum.TASKS_LIST_ADDED]: {
    userId: string;
    listId: string;
    teamId?: string;
    list?: List;
  };
  [GlobalEventsEnum.TASKS_LIST_EDITED]: {
    userId: string;
    listId: string;
    teamId?: string;
    list?: List;
  };
  [GlobalEventsEnum.TASKS_LIST_DELETED]: {
    userId: string;
    listId: string;
    teamId?: string;
    list?: List;
  };
  [GlobalEventsEnum.TASKS_LIST_ADD_VISIBLE]: {
    userId: string;
    listId: string;
    teamId?: string;
    list?: List;
  };
  [GlobalEventsEnum.TASKS_LIST_REMOVE_VISIBLE]: {
    userId: string;
    listId: string;
    teamId?: string;
    list?: List;
  };
  // Calendars
  [GlobalEventsEnum.CALENDAR_CALENDAR_ADDED]: {
    userId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_EDITED]: {
    userId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_DELETED]: {
    userId: string;
    calendarId: string;
    isHardDelete?: boolean;
    calendar?: Calendar;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_UNDELETED]: {
    userId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_ADD_VISIBLE]: {
    userId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_REMOVE_VISIBLE]: {
    userId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
  };
  // Events
  [GlobalEventsEnum.CALENDAR_EVENT_ADDED]: {
    userId: string;
    eventId: string;
    calendarId: string;
    teamId?: string;
    event?: Event;
  };
  [GlobalEventsEnum.CALENDAR_EVENT_EDITED]: {
    userId: string;
    eventId: string;
    calendarId: string;
    teamId?: string;
    event?: Event;
  };
  [GlobalEventsEnum.CALENDAR_EVENT_DELETED]: {
    userId: string;
    eventId: string;
    calendarId: string;
    isHardDelete?: boolean;
    teamId?: string;
    event?: Event;
  };
  [GlobalEventsEnum.CALENDAR_EVENT_UNDELETED]: {
    userId: string;
    eventId: string;
    calendarId: string;
    teamId?: string;
    event?: Event;
  };
  // Focus
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]: {
    userId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_EDITED]: {
    userId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_DELETED]: {
    userId: string;
    focusSessionId: string;
    isHardDelete?: boolean;
    focusSession?: FocusSession;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_UNDELETED]: {
    userId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]: {
    userId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ACTION_TRIGGERED]: {
    userId: string;
    focusSessionId: string;
    action: FocusSessionUpdateActionEnum;
    focusSession?: FocusSession;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED]: {
    userId: string;
    focusSessionId: string;
    stage: FocusSessionStageEnum;
    focusSession?: FocusSession;
  };
  // Mood
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: {
    userId: string;
    moodEntryId: string;
    moodEntry?: MoodEntry;
  };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED]: {
    userId: string;
    moodEntryId: string;
    moodEntry?: MoodEntry;
  };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED]: {
    userId: string;
    moodEntryId: string;
    isHardDelete?: boolean;
    moodEntry?: MoodEntry;
  };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED]: {
    userId: string;
    moodEntryId: string;
    moodEntry?: MoodEntry;
  };
  // Notifications
  [GlobalEventsEnum.NOTIFICATIONS_NOTIFICATION_MARKED_AS_READ]: {
    userId: string;
    userNotificationId: string;
  };
  [GlobalEventsEnum.NOTIFICATIONS_NOTIFICATION_MARKED_AS_UNREAD]: {
    userId: string;
    userNotificationId: string;
  };
};

import { Team } from '../auth/teams/TeamSchema';
import { Calendar } from '../calendar/CalendarSchema';
import { Event } from '../calendar/EventSchema';
import { FocusSession } from '../focus/FocusSessionSchema';
import { FocusSessionStageEnum } from '../focus/FocusSessionStageEnum';
import { FocusSessionUpdateActionEnum } from '../focus/FocusSessionUpdateActionEnum';
import { MoodEntry } from '../mood/MoodEntrySchema';
import { List } from '../tasks/ListSchema';
import { Task } from '../tasks/TaskSchema';

export enum GlobalEventsEnum {
  // Auth
  AUTH_USER_REGISTERED = 'auth:user:registered',
  AUTH_USER_LOGGED_IN = 'auth:user:logged-in',
  AUTH_USER_LOGGED_OUT = 'auth:user:logged-out',
  AUTH_USER_UPDATED = 'auth:user:updated',
  AUTH_USER_FOLLOWED_USER = 'auth:user:followed-user',
  AUTH_USER_APPROVE_FOLLOWED_USER = 'auth:user:approve-followed-user',
  AUTH_USER_REMOVE_FOLLOWED_USER = 'auth:user:remove-followed-user',
  AUTH_USER_UNFOLLOWED_USER = 'auth:user:unfollowed-user',
  AUTH_USER_BLOCKED_USER = 'auth:user:blocked-user',
  AUTH_USER_UNBLOCKED_USER = 'auth:user:unblocked-user',
  AUTH_USER_REPORTED_USER = 'auth:user:reported-user',
  // Teams
  TEAMS_TEAM_ADDED = 'teams:team:added',
  TEAMS_TEAM_EDITED = 'teams:team:edited',
  TEAMS_TEAM_DELETED = 'teams:team:deleted',
  TEAMS_TEAM_UNDELETED = 'teams:team:undeleted',
  TEAMS_TEAM_MEMBER_INVITED = 'teams:team-member:invited',
  TEAMS_TEAM_MEMBER_INVITE_ACCEPTED = 'teams:team-member:invite-accepted',
  TEAMS_TEAM_MEMBER_INVITE_REJECTED = 'teams:team-member:invite-rejected',
  TEAMS_TEAM_MEMBER_INVITE_DELETED = 'teams:team-member:invite-deleted',
  TEAMS_TEAM_MEMBER_UPDATED = 'teams:team-member:updated',
  TEAMS_TEAM_MEMBER_DELETED = 'teams:team-member:deleted',
  TEAMS_TEAM_MEMBER_LEFT = 'teams:team-member:left',
  // Tasks
  TASKS_TASK_ADDED = 'tasks:task:added',
  TASKS_TASK_EDITED = 'tasks:task:edited',
  TASKS_TASK_DELETED = 'tasks:task:deleted',
  TASKS_TASK_UNDELETED = 'tasks:task:undeleted',
  TASKS_TASK_COMPLETED = 'tasks:task:completed',
  TASKS_TASK_UNCOMPLETED = 'tasks:task:uncompleted',
  TASKS_TASK_DUPLICATED = 'tasks:task:duplicated',
  TASKS_TASK_ASSIGNED_TO_USER = 'tasks:task:assigned-to-user',
  TASKS_TASK_NUDGED = 'tasks:task:nudged',
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
  NOTIFICATIONS_USER_NOTIFICATION_ADDED = 'notifications:user-notification:added',
  NOTIFICATIONS_USER_NOTIFICATION_DELETED = 'notifications:user-notification:deleted',
  NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ = 'notifications:user-notification:marked-as-read',
  NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_UNREAD = 'notifications:user-notification:marked-as-unread',
  NOTIFICATIONS_USER_NOTIFICATION_MARKED_ALL_AS_READ = 'notifications:user-notification:marked-all-as-unread',
}

export type GlobalEvents = {
  // Auth
  [GlobalEventsEnum.AUTH_USER_REGISTERED]: {
    actorUserId: string; // Who was the user that triggered this action?
    userId: string;
    actorWebsocketToken?: string; // Which tab/websocket connection was the user using when they registered and triggered the action? Used to keep in sync multiple tabs
  };
  [GlobalEventsEnum.AUTH_USER_LOGGED_IN]: {
    actorUserId: string;
    userId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_LOGGED_OUT]: {
    actorUserId: string;
    userId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_UPDATED]: {
    actorUserId: string;
    userId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_FOLLOWED_USER]: {
    actorUserId: string;
    userId: string; // This is the actual user that was unfollowed?
    userFollowedUserId: string; // This is the relationship entity - user_followed table row
    needsApproval: boolean;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_APPROVE_FOLLOWED_USER]: {
    actorUserId: string;
    userId: string;
    userFollowedUserId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_REMOVE_FOLLOWED_USER]: {
    actorUserId: string;
    userId: string;
    userFollowedUserId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_UNFOLLOWED_USER]: {
    actorUserId: string;
    userId: string;
    userFollowedUserId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_BLOCKED_USER]: {
    actorUserId: string;
    userId: string;
    userBlockedUserId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_UNBLOCKED_USER]: {
    actorUserId: string;
    userId: string;
    userBlockedUserId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.AUTH_USER_REPORTED_USER]: {
    actorUserId: string;
    userId: string;
    reportId: string;
    actorWebsocketToken?: string;
  };
  // Teams
  [GlobalEventsEnum.TEAMS_TEAM_ADDED]: {
    actorUserId: string;
    teamId: string;
    team?: Team;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_EDITED]: {
    actorUserId: string;
    teamId: string;
    team?: Team;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_DELETED]: {
    actorUserId: string;
    teamId: string;
    isHardDelete?: boolean;
    team?: Team;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_UNDELETED]: {
    actorUserId: string;
    teamId: string;
    team?: Team;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITED]: {
    actorUserId: string;
    teamId: string;
    teamUserInvitationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITE_ACCEPTED]: {
    actorUserId: string;
    teamId: string;
    userId: string;
    teamUserInvitationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITE_REJECTED]: {
    actorUserId: string;
    teamId: string;
    userId: string;
    teamUserInvitationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITE_DELETED]: {
    actorUserId: string;
    teamId: string;
    userId: string;
    teamUserInvitationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_UPDATED]: {
    actorUserId: string;
    teamId: string;
    userId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_DELETED]: {
    actorUserId: string;
    teamId: string;
    userId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TEAMS_TEAM_MEMBER_LEFT]: {
    actorUserId: string;
    teamId: string;
    userId: string;
    actorWebsocketToken?: string;
  };
  // Tasks
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    actorUserId: string; // Who did the action?
    taskId: string; // What task was added?
    listId?: string; // What list was the task added to?
    teamId?: string; // For what team was the task added (the teamId from the list)?
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_EDITED]: {
    actorUserId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_DELETED]: {
    actorUserId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    isHardDelete?: boolean;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_UNDELETED]: {
    actorUserId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: {
    actorUserId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_UNCOMPLETED]: {
    actorUserId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_DUPLICATED]: {
    actorUserId: string;
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER]: {
    actorUserId: string; // Which user assigned it? Just so  we are consistent with the other events. The userId is the user that triggers the action
    userId: string; // To which user was it assigned?
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_TASK_NUDGED]: {
    actorUserId: string;
    userIds: string[]; // which users were nudged?
    taskId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_REORDERED]: {
    actorUserId: string;
    listId?: string;
    teamId?: string;
    task?: Task;
    actorWebsocketToken?: string;
  };
  // Tasks - Lists
  [GlobalEventsEnum.TASKS_LIST_ADDED]: {
    actorUserId: string;
    listId: string;
    teamId?: string;
    list?: List;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_LIST_EDITED]: {
    actorUserId: string;
    listId: string;
    teamId?: string;
    list?: List;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_LIST_DELETED]: {
    actorUserId: string;
    listId: string;
    teamId?: string;
    list?: List;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_LIST_ADD_VISIBLE]: {
    actorUserId: string;
    listId: string;
    teamId?: string;
    list?: List;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.TASKS_LIST_REMOVE_VISIBLE]: {
    actorUserId: string;
    listId: string;
    teamId?: string;
    list?: List;
    actorWebsocketToken?: string;
  };
  // Calendars
  [GlobalEventsEnum.CALENDAR_CALENDAR_ADDED]: {
    actorUserId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_EDITED]: {
    actorUserId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_DELETED]: {
    actorUserId: string;
    calendarId: string;
    teamId?: string;
    isHardDelete?: boolean;
    calendar?: Calendar;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_UNDELETED]: {
    actorUserId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_ADD_VISIBLE]: {
    actorUserId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_CALENDAR_REMOVE_VISIBLE]: {
    actorUserId: string;
    calendarId: string;
    teamId?: string;
    calendar?: Calendar;
    actorWebsocketToken?: string;
  };
  // Events
  [GlobalEventsEnum.CALENDAR_EVENT_ADDED]: {
    actorUserId: string;
    eventId: string;
    calendarId: string;
    teamId?: string;
    event?: Event;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_EVENT_EDITED]: {
    actorUserId: string;
    eventId: string;
    calendarId: string;
    teamId?: string;
    event?: Event;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_EVENT_DELETED]: {
    actorUserId: string;
    eventId: string;
    calendarId: string;
    isHardDelete?: boolean;
    teamId?: string;
    event?: Event;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.CALENDAR_EVENT_UNDELETED]: {
    actorUserId: string;
    eventId: string;
    calendarId: string;
    teamId?: string;
    event?: Event;
    actorWebsocketToken?: string;
  };
  // Focus
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]: {
    actorUserId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_EDITED]: {
    actorUserId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_DELETED]: {
    actorUserId: string;
    focusSessionId: string;
    isHardDelete?: boolean;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_UNDELETED]: {
    actorUserId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]: {
    actorUserId: string;
    focusSessionId: string;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ACTION_TRIGGERED]: {
    actorUserId: string;
    focusSessionId: string;
    action: FocusSessionUpdateActionEnum;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED]: {
    actorUserId: string;
    focusSessionId: string;
    stage: FocusSessionStageEnum;
    focusSession?: FocusSession;
    actorWebsocketToken?: string;
  };
  // Mood
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: {
    actorUserId: string;
    moodEntryId: string;
    moodEntry?: MoodEntry;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED]: {
    actorUserId: string;
    moodEntryId: string;
    moodEntry?: MoodEntry;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED]: {
    actorUserId: string;
    moodEntryId: string;
    isHardDelete?: boolean;
    moodEntry?: MoodEntry;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED]: {
    actorUserId: string;
    moodEntryId: string;
    moodEntry?: MoodEntry;
    actorWebsocketToken?: string;
  };
  // Notifications
  [GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_ADDED]: {
    actorUserId: string;
    userNotificationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_DELETED]: {
    actorUserId: string;
    userNotificationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_READ]: {
    actorUserId: string;
    userNotificationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_AS_UNREAD]: {
    actorUserId: string;
    userNotificationId: string;
    actorWebsocketToken?: string;
  };
  [GlobalEventsEnum.NOTIFICATIONS_USER_NOTIFICATION_MARKED_ALL_AS_READ]: {
    actorUserId: string;
    actorWebsocketToken?: string;
  };
};

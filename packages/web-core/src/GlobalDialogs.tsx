import CalendarDeleteAlertDialog from './features/calendar/components/calendar-delete-alert-dialog/CalendarDeleteAlertDialog';
import CalendarEditDialog from './features/calendar/components/calendar-edit-dialog/CalendarEditDialog';
import DeletedCalendarsDialog from './features/calendar/components/deleted-calendars-dialog/DeletedCalendarsDialog';
import EventEditDialog from './features/calendar/components/event-edit-dialog/EventEditDialog';
import PublicCalendarsDialog from './features/calendar/components/public-calendars-dialog/PublicCalendarsDialog';
import UserCalendarEditDialog from './features/calendar/components/user-calendar-edit-dialog/UserCalendarEditDialog';
import CommandsDialog from './features/commands/components/CommandsDialog';
import DeletedGoalsDialog from './features/goals/components/deleted-goals-dialog/DeletedGoalsDialog';
import GoalEditDialog from './features/goals/components/goal-edit-dialog/GoalEditDialog';
import DeletedHabitsDialog from './features/habits/components/deleted-habits-dialog/DeletedHabitsDialog';
import HabitEditDialog from './features/habits/components/habit-edit-dialog/HabitEditDialog';
import HabitTemplatesDialog from './features/habits/components/habit-templates-dialog/HabitTemplatesDialog';
import MoodEntryEditDialog from './features/mood/components/mood-entry-edit-dialog/MoodEntryEditDialog';
import SettingsDialog from './features/settings/components/SettingsDialog';
import DeletedListsDialog from './features/tasks/components/deleted-lists-dialog/DeletedListsDialog';
import ListDeleteAlertDialog from './features/tasks/components/list-delete-alert-dialog/ListDeleteAlertDialog';
import ListEditDialog from './features/tasks/components/list-edit-dialog/ListEditDialog';
import TagEditDialog from './features/tasks/components/tag-edit-dialog/TagEditDialog';
import TagsDialog from './features/tasks/components/tags-dialog/TagsDialog';
import TaskEditDialog from './features/tasks/components/task-edit-dialog/TaskEditDialog';
import TaskUsersNudgeDialog from './features/tasks/components/task-users-nudge-dialog/TaskUsersNudgeDialog';
import TasksPopover from './features/tasks/components/TasksPopover';
import TeamEditDialog from './features/teams/components/team-edit-dialog/TeamEditDialog';

export function GlobalDialogs() {
  return (
    <>
      <TaskEditDialog />
      <TaskUsersNudgeDialog />
      <ListEditDialog />
      <ListDeleteAlertDialog />
      <DeletedListsDialog />
      <TagsDialog />
      <TagEditDialog />
      <HabitEditDialog />
      <DeletedHabitsDialog />
      <HabitTemplatesDialog />
      <GoalEditDialog />
      <DeletedGoalsDialog />
      <SettingsDialog />
      <CalendarEditDialog />
      <UserCalendarEditDialog />
      <EventEditDialog />
      <DeletedCalendarsDialog />
      <PublicCalendarsDialog />
      <CalendarDeleteAlertDialog />
      <MoodEntryEditDialog />
      <TeamEditDialog />
      <TasksPopover />
      <CommandsDialog />
    </>
  );
}

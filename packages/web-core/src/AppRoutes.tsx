import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthConfirmEmailPage from './features/auth/components/pages/AuthConfirmEmailPage';
import AuthDeleteAccountPage from './features/auth/components/pages/AuthDeleteAccountPage';
import AuthForgotPasswordPage from './features/auth/components/pages/AuthForgotPasswordPage';
import AuthLoginPage from './features/auth/components/pages/AuthLoginPage';
import AuthRegisterPage from './features/auth/components/pages/AuthRegisterPage';
import AuthResetPasswordPage from './features/auth/components/pages/AuthResetPasswordPage';
import { useAuthUserSetting } from './features/auth/state/authStore';
import CalendarDeleteAlertDialog from './features/calendar/components/calendar-delete-alert-dialog/CalendarDeleteAlertDialog';
import CalendarEditDialog from './features/calendar/components/calendar-edit-dialog/CalendarEditDialog';
import DeletedCalendarsDialog from './features/calendar/components/deleted-calendars-dialog/DeletedCalendarsDialog';
import EventEditDialog from './features/calendar/components/event-edit-dialog/EventEditDialog';
import CalendarPage from './features/calendar/components/pages/CalendarPage';
import PublicCalendarsDialog from './features/calendar/components/public-calendars-dialog/PublicCalendarsDialog';
import UserCalendarEditDialog from './features/calendar/components/user-calendar-edit-dialog/UserCalendarEditDialog';
import CommandsDialog from './features/commands/components/CommandsDialog';
import ProtectedRoute from './features/core/components/ProtectedRoute';
import PublicOnlyRoute from './features/core/components/PublicOnlyRoute';
import HomePage from './features/core/pages/HomePage';
import NotFoundPage from './features/core/pages/NotFoundPage';
import MoodEntryEditDialog from './features/mood/components/mood-entry-edit-dialog/MoodEntryEditDialog';
import MoodPage from './features/mood/components/pages/MoodPage';
import NotesPage from './features/notes/components/pages/NotesPage';
import SettingsDialog from './features/settings/components/SettingsDialog';
import ListDeleteAlertDialog from './features/tasks/components/list-delete-alert-dialog/ListDeleteAlertDialog';
import ListEditDialog from './features/tasks/components/list-edit-dialog/ListEditDialog';
import TagEditDialog from './features/tasks/components/tag-edit-dialog/TagEditDialog';
import TagsDialog from './features/tasks/components/tags-dialog/TagsDialog';
import TaskEditDialog from './features/tasks/components/task-edit-dialog/TaskEditDialog';
import TasksPopover from './features/tasks/components/TasksPopover';

function GlobalDialogs() {
  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);

  return (
    <>
      <TaskEditDialog />
      <ListEditDialog />
      <ListDeleteAlertDialog />
      <TagsDialog />
      <TagEditDialog />
      <SettingsDialog />
      <CalendarEditDialog />
      <UserCalendarEditDialog />
      <EventEditDialog />
      <DeletedCalendarsDialog />
      <PublicCalendarsDialog />
      <CalendarDeleteAlertDialog />
      <MoodEntryEditDialog />
      <TasksPopover />
      {commandsEnabled && <CommandsDialog />}
    </>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar/*"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/*"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood/*"
          element={
            <ProtectedRoute>
              <MoodPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <AuthLoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <AuthRegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <AuthForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <AuthResetPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/confirm-email" element={<AuthConfirmEmailPage />} />
        <Route path="/delete-account" element={<AuthDeleteAccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalDialogs />
    </BrowserRouter>
  );
}

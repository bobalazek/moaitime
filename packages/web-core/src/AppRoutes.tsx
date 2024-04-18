import { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import { GlobalEventsEnum } from '@moaitime/shared-common';

import AuthConfirmEmailPage from './features/auth/components/pages/AuthConfirmEmailPage';
import AuthDeleteAccountPage from './features/auth/components/pages/AuthDeleteAccountPage';
import AuthForgotPasswordPage from './features/auth/components/pages/AuthForgotPasswordPage';
import AuthLoginPage from './features/auth/components/pages/AuthLoginPage';
import AuthPasswordlessLoginPage from './features/auth/components/pages/AuthPasswordlessLoginPage';
import AuthRegisterPage from './features/auth/components/pages/AuthRegisterPage';
import AuthResetPasswordPage from './features/auth/components/pages/AuthResetPasswordPage';
import CalendarPage from './features/calendar/components/pages/CalendarPage';
import ProtectedRoute from './features/core/components/ProtectedRoute';
import PublicOnlyRoute from './features/core/components/PublicOnlyRoute';
import HomePage from './features/core/pages/HomePage';
import NotFoundPage from './features/core/pages/NotFoundPage';
import PrivacyPage from './features/core/pages/PrivacyPage';
import TermsPage from './features/core/pages/TermsPage';
import { globalEventsEmitter } from './features/core/state/globalEventsEmitter';
import FocusPage from './features/focus/components/pages/FocusPage';
import HabitsPage from './features/habits/components/pages/HabitsPage';
import MoodPage from './features/mood/components/pages/MoodPage';
import NotesPage from './features/notes/components/pages/NotesPage';
import NotificationsPage from './features/notifications/components/pages/NotificationsPage';
import SocialPage from './features/social/components/pages/SocialPage';
import SocialUserSearchPage from './features/social/components/pages/SocialUserSearchPage';
import SocialUsersViewPage from './features/social/components/pages/SocialUsersViewPage';
import StatisticsPage from './features/statistics/components/pages/StatisticsPage';
import { GlobalDialogs } from './GlobalDialogs';

function NavigationEvenListener() {
  const navigate = useNavigate();

  useEffect(() => {
    globalEventsEmitter.on(GlobalEventsEnum.NAVIGATE_TO, (payload) => {
      navigate(payload.location);
    });
  }, [navigate]);

  return null;
}

function MobileFocusListener() {
  const focusedInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const onFocus = (event: FocusEvent) => {
      const tagName = event.target ? (event.target as unknown as { tagName: string }).tagName : '';
      if (tagName === 'INPUT') {
        focusedInputRef.current = event.target as unknown as HTMLInputElement;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && focusedInputRef.current) {
        focusedInputRef.current.blur();
      }
    };

    document.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('keypress', onKeyDown);
    };
  }, []);

  return null;
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
          path="/notifications/*"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/*"
          element={
            <ProtectedRoute>
              <HabitsPage />
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
          path="/focus/*"
          element={
            <ProtectedRoute>
              <FocusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics/*"
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social"
          element={
            <ProtectedRoute>
              <SocialPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social/user-search"
          element={
            <ProtectedRoute>
              <SocialUserSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/social/users/:userUsername/*"
          element={
            <ProtectedRoute>
              <SocialUsersViewPage />
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
          path="/passwordless-login"
          element={
            <PublicOnlyRoute>
              <AuthPasswordlessLoginPage />
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
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalDialogs />
      <NavigationEvenListener />
      <MobileFocusListener />
    </BrowserRouter>
  );
}

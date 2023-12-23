import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthConfirmEmailPage from './features/auth/components/pages/AuthConfirmEmailPage';
import AuthForgotPasswordPage from './features/auth/components/pages/AuthForgotPasswordPage';
import AuthLoginPage from './features/auth/components/pages/AuthLoginPage';
import AuthRegisterPage from './features/auth/components/pages/AuthRegisterPage';
import AuthResetPasswordPage from './features/auth/components/pages/AuthResetPasswordPage';
import CalendarPage from './features/calendar/components/pages/CalendarPage';
import ProtectedRoute from './features/core/components/ProtectedRoute';
import PublicOnlyRoute from './features/core/components/PublicOnlyRoute';
import HomePage from './features/core/pages/HomePage';
import NotFoundPage from './features/core/pages/NotFoundPage';
import NotesPage from './features/notes/components/pages/NotesPage';

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
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

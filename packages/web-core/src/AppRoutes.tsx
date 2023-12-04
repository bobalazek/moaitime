import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthForgotPasswordPage from './features/auth/components/pages/AuthForgotPasswordPage';
import AuthLoginPage from './features/auth/components/pages/AuthLoginPage';
import AuthRegisterPage from './features/auth/components/pages/AuthRegisterPage';
import AuthResetPasswordPage from './features/auth/components/pages/AuthResetPasswordPage';
import ProtectedRoute from './features/core/components/ProtectedRoute';
import HomePage from './features/core/pages/HomePage';
import NotFoundPage from './features/core/pages/NotFoundPage';

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
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/register" element={<AuthRegisterPage />} />
        <Route path="/forgot-password" element={<AuthForgotPasswordPage />} />
        <Route path="/reset-password" element={<AuthResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

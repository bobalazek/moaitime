import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { AuthInterface, UpdateUserInterface } from '@myzenbuddy/shared-common';

import {
  cancelNewEmailConfirmation,
  login,
  logout,
  me,
  refreshToken,
  register,
  requestPasswordReset,
  resendEmailConfirmation,
  resendNewEmailConfirmation,
  resetPassword,
  updateSettings,
} from '../utils/AuthHelpers';

export type AuthStore = {
  auth: AuthInterface | null;
  setAuth: (auth: AuthInterface | null) => Promise<void>;
  // Login
  login: (email: string, password: string) => Promise<void>;
  // Logout
  logout: () => Promise<void>;
  // Register
  register: (displayName: string, email: string, password: string) => Promise<void>;
  // Request Password Reset
  requestPasswordReset: (email: string) => Promise<void>;
  // Reset Password
  resetPassword: (token: string, password: string) => Promise<void>;
  // Refresh Token
  refreshToken: () => Promise<void>;
  // Resend Email Confirmation
  resendEmailConfirmation: () => Promise<void>;
  // Resend New Email Confirmation
  resendNewEmailConfirmation: () => Promise<void>;
  // Cancel New Email Confirmation
  cancelNewEmailConfirmation: () => Promise<void>;
  // Me
  me: () => Promise<void>;
  // Update Settings
  updateSettings: (data: UpdateUserInterface) => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set, get) => ({
      auth: null,
      setAuth: async (auth: AuthInterface | null) => {
        set({ auth });
      },
      // Login
      login: async (email: string, password: string) => {
        const { data: auth } = await login(email, password);

        set({ auth });
      },
      // Logout
      logout: async () => {
        await logout();

        set({ auth: null });
      },
      // Register
      register: async (displayName: string, email: string, password: string) => {
        const { data: auth } = await register(displayName, email, password);

        set({ auth });
      },
      // Request Password Reset
      requestPasswordReset: async (email: string) => {
        await requestPasswordReset(email);
      },
      // Reset Password
      resetPassword: async (token: string, password: string) => {
        await resetPassword(token, password);
      },
      // Refresh Token
      refreshToken: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.refreshToken) {
          throw new Error('No refresh token found');
        }

        const { data: newAuth } = await refreshToken(auth.userAccessToken.refreshToken);

        set({ auth: newAuth });
      },
      // Resend Email Confirmation
      resendEmailConfirmation: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        await resendEmailConfirmation();
      },
      // Resend New Email Confirmation
      resendNewEmailConfirmation: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        await resendNewEmailConfirmation();
      },
      // Cancel New Email Confirmation
      cancelNewEmailConfirmation: async () => {
        const { auth, me } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        await cancelNewEmailConfirmation();

        await me();
      },
      // Me
      me: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const { data: newAuth } = await me();

        set({ auth: newAuth });
      },
      // Update
      updateSettings: async (data: UpdateUserInterface) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const { data: newAuth } = await updateSettings(data);

        set({ auth: newAuth });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return {
          auth: state.auth ?? null,
        } as AuthStore;
      },
      onRehydrateStorage: () => {
        return (state) => {
          if (!state) {
            return;
          }

          if (state?.auth?.userAccessToken?.expiresAt) {
            const now = new Date().getTime();
            const expiresAt = new Date(state.auth.userAccessToken.expiresAt).getTime();
            if (expiresAt < now) {
              state.setAuth(null);
            }
          }

          // Make sure that the store at that point is ready
          setTimeout(async () => {
            try {
              await state.me();
            } catch (error) {
              // Nothing to do
            }
          }, 0);
        };
      },
    }
  )
);

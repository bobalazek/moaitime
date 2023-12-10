import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  AuthInterface,
  ResponseInterface,
  UpdateUserInterface,
  UpdateUserPasswordInterface,
} from '@myzenbuddy/shared-common';

import { useTasksStore } from '../../tasks/state/tasksStore';
import {
  cancelNewEmail,
  confirmEmail,
  loadAccount,
  login,
  logout,
  refreshToken,
  register,
  requestPasswordReset,
  resendEmailConfirmation,
  resetPassword,
  updateAccountPassword,
  updateAccountSettings,
} from '../utils/AuthHelpers';

export type AuthStore = {
  auth: AuthInterface | null;
  setAuth: (auth: AuthInterface | null) => Promise<void>;
  // Login
  login: (email: string, password: string) => Promise<ResponseInterface>;
  // Logout
  logout: () => Promise<ResponseInterface>;
  // Register
  register: (displayName: string, email: string, password: string) => Promise<ResponseInterface>;
  // Request Password Reset
  requestPasswordReset: (email: string) => Promise<ResponseInterface>;
  // Reset Password
  resetPassword: (token: string, password: string) => Promise<ResponseInterface>;
  // Confirm Email
  confirmEmail: (token: string, isNewEmail?: boolean) => Promise<ResponseInterface>;
  // Refresh Token
  refreshToken: () => Promise<ResponseInterface>;
  // Resend Email Confirmation
  resendEmailConfirmation: (isNewEmail?: boolean) => Promise<ResponseInterface>;
  // Cancel New Email Confirmation
  cancelNewEmail: () => Promise<ResponseInterface>;
  // Account
  loadAccount: () => Promise<ResponseInterface>;
  updateAccountSettings: (data: UpdateUserInterface) => Promise<ResponseInterface>;
  accountPasswordSettingsDialogOpen: boolean;
  setAccountPasswordSettingsDialogOpen: (accountPasswordSettingsDialogOpen: boolean) => void;
  updateAccountPassword: (data: UpdateUserPasswordInterface) => Promise<ResponseInterface>;
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
        const response = await login(email, password);

        set({ auth: response.data });

        return response;
      },
      // Logout
      logout: async () => {
        const response = await logout();

        set({ auth: null });

        return response;
      },
      // Register
      register: async (displayName: string, email: string, password: string) => {
        const response = await register(displayName, email, password);

        set({ auth: response.data });

        return response;
      },
      // Request Password Reset
      requestPasswordReset: async (email: string) => {
        const response = await requestPasswordReset(email);

        return response;
      },
      // Reset Password
      resetPassword: async (token: string, password: string) => {
        const response = await resetPassword(token, password);

        return response;
      },
      // Confirm Email
      confirmEmail: async (token: string, isNewEmail?: boolean) => {
        const response = await confirmEmail(token, isNewEmail);

        return response;
      },
      // Refresh Token
      refreshToken: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.refreshToken) {
          throw new Error('No refresh token found');
        }

        const response = await refreshToken(auth.userAccessToken.refreshToken);

        set({ auth: response.data });

        return response;
      },
      // Resend Email Confirmation
      resendEmailConfirmation: async (isNewEmail?: boolean) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await resendEmailConfirmation(isNewEmail);

        return response;
      },
      // Cancel New Email
      cancelNewEmail: async () => {
        const { auth, loadAccount } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await cancelNewEmail();

        await loadAccount();

        return response;
      },
      // Account
      loadAccount: async () => {
        const { loadLists } = useTasksStore.getState();
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await loadAccount();

        set({ auth: response.data });

        // Make sure we load the new lists for that user
        await loadLists();

        return response;
      },
      // Settings
      // Update Settings
      updateAccountSettings: async (data: UpdateUserInterface) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await updateAccountSettings(data);

        set({ auth: response.data });

        return response;
      },
      // Update Password Settings
      accountPasswordSettingsDialogOpen: false,
      setAccountPasswordSettingsDialogOpen: (accountPasswordSettingsDialogOpen: boolean) => {
        set({ accountPasswordSettingsDialogOpen });
      },
      updateAccountPassword: async (data: UpdateUserPasswordInterface) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await updateAccountPassword(data);

        set({ auth: response.data });

        return response;
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
              await state.loadAccount();
            } catch (error) {
              // Nothing to do
            }
          }, 0);
        };
      },
    }
  )
);

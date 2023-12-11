import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  Auth,
  ResponseInterface,
  UpdateUser,
  UpdateUserPassword,
  UpdateUserSettings,
} from '@myzenbuddy/shared-common';

import { useBackgroundStore } from '../../background/state/backgroundStore';
import { useGreetingStore } from '../../greeting/state/greetingStore';
import { useQuoteStore } from '../../quote/state/quoteStore';
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
  updateAccount,
  updateAccountPassword,
  updateAccountSettings,
} from '../utils/AuthHelpers';

export type AuthStore = {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => Promise<void>;
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
  updateAccount: (data: UpdateUser) => Promise<ResponseInterface>;
  updateAccountPassword: (data: UpdateUserPassword) => Promise<ResponseInterface>;
  updateAccountSettings: (data: UpdateUserSettings) => Promise<ResponseInterface>;
  // Account Password Settings Dialog
  accountPasswordSettingsDialogOpen: boolean;
  setAccountPasswordSettingsDialogOpen: (accountPasswordSettingsDialogOpen: boolean) => void;
  // App Data
  loadAppData: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set, get) => ({
      auth: null,
      setAuth: async (auth: Auth | null) => {
        set({ auth });
      },
      // Login
      login: async (email: string, password: string) => {
        const { loadAppData } = get();

        const response = await login(email, password);

        set({ auth: response.data });

        loadAppData();

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
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await loadAccount();

        set({ auth: response.data });

        return response;
      },
      updateAccount: async (data: UpdateUser) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await updateAccount(data);

        set({ auth: response.data });

        return response;
      },
      updateAccountPassword: async (data: UpdateUserPassword) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await updateAccountPassword(data);

        set({ auth: response.data });

        return response;
      },
      updateAccountSettings: async (data: UpdateUserSettings) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await updateAccountSettings(data);

        set({ auth: response.data });

        return response;
      },
      // Account Password Settings Dialog
      accountPasswordSettingsDialogOpen: false,
      setAccountPasswordSettingsDialogOpen: (accountPasswordSettingsDialogOpen: boolean) => {
        set({ accountPasswordSettingsDialogOpen });
      },
      // App Data
      loadAppData: async () => {
        const { auth } = get();
        const { loadLists } = useTasksStore.getState();
        const { loadBackgrounds, setRandomBackground } = useBackgroundStore.getState();
        const { loadGreetings, setRandomGreeting } = useGreetingStore.getState();
        const { loadQuotes, setRandomQuote } = useQuoteStore.getState();

        if (!auth?.userAccessToken?.token) {
          return;
        }

        loadLists();

        (async () => {
          await loadBackgrounds();

          setRandomBackground();
          setInterval(setRandomBackground, 1000 * 60 * 2);
        })();

        // Greetings
        (async () => {
          await loadGreetings();

          setRandomGreeting();
          setInterval(setRandomGreeting, 1000 * 60 * 2);
        })();

        // Quotes
        (async () => {
          await loadQuotes();

          setRandomQuote();
          setTimeout(setRandomQuote, 1000 * 60 * 2);
        })();
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
              await state.loadAppData();
            } catch (error) {
              // Nothing to do
            }
          }, 0);
        };
      },
    }
  )
);

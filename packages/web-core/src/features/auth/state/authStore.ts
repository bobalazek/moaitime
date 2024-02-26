import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  Auth,
  RegisterUser,
  ResponseInterface,
  UpdateUser,
  UpdateUserPassword,
  UpdateUserSettings,
  UserSettings,
} from '@moaitime/shared-common';
import { sonnerToast } from '@moaitime/web-ui';

import { useAppStore } from '../../core/state/appStore';
import {
  cancelNewEmail,
  confirmEmail,
  deleteAccount,
  deleteAccountAvatar,
  doPing,
  getAccount,
  login,
  logout,
  refreshToken,
  register,
  requestAccountDeletion,
  requestDataExport,
  requestPasswordReset,
  resendEmailConfirmation,
  resetPassword,
  updateAccount,
  updateAccountPassword,
  updateAccountSettings,
  uploadAccountAvatar,
} from '../utils/AuthHelpers';

export type AuthStore = {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => Promise<void>;
  // Login
  login: (email: string, password: string) => Promise<ResponseInterface>;
  // Logout
  logout: () => Promise<ResponseInterface>;
  // Register
  register: (data: RegisterUser) => Promise<ResponseInterface>;
  // Reset Password
  requestPasswordReset: (email: string) => Promise<ResponseInterface>;
  resetPassword: (token: string, password: string) => Promise<ResponseInterface>;
  // Account Deletion
  requestAccountDeletion: () => Promise<ResponseInterface>;
  deleteAccount: (token: string) => Promise<ResponseInterface>;
  // Data Export
  requestDataExport: () => Promise<ResponseInterface>;
  // Confirm Email
  confirmEmail: (token: string, isNewEmail?: boolean) => Promise<ResponseInterface>;
  // Refresh Token
  refreshToken: () => Promise<ResponseInterface>;
  // Resend Email Confirmation
  resendEmailConfirmation: (isNewEmail?: boolean) => Promise<ResponseInterface>;
  // Cancel New Email Confirmation
  cancelNewEmail: () => Promise<ResponseInterface>;
  // Account
  reloadAccount: () => Promise<ResponseInterface>;
  updateAccount: (data: UpdateUser) => Promise<ResponseInterface>;
  updateAccountPassword: (data: UpdateUserPassword) => Promise<ResponseInterface>;
  updateAccountSettings: (data: UpdateUserSettings) => Promise<ResponseInterface>;
  uploadAccountAvatar: (file: File) => Promise<ResponseInterface>;
  deleteAccountAvatar: () => Promise<ResponseInterface>;
  // Account Password Settings Dialog
  accountPasswordSettingsDialogOpen: boolean;
  setAccountPasswordSettingsDialogOpen: (accountPasswordSettingsDialogOpen: boolean) => void;
  // Ping
  doPing: () => Promise<void>;
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
        const { reloadAppData } = useAppStore.getState();

        const response = await login(email, password);

        set({ auth: response.data });

        reloadAppData();

        return response;
      },
      // Logout
      logout: async () => {
        const response = await logout();

        set({ auth: null });

        localStorage.removeItem('device-uid');

        return response;
      },
      // Register
      register: async (data: RegisterUser) => {
        const response = await register(data);

        set({ auth: response.data });

        return response;
      },
      // Reset Password
      requestPasswordReset: async (email: string) => {
        const response = await requestPasswordReset(email);

        return response;
      },
      resetPassword: async (token: string, password: string) => {
        const response = await resetPassword(token, password);

        return response;
      },
      // Account Deletion
      requestAccountDeletion: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await requestAccountDeletion();

        return response;
      },
      deleteAccount: async (token: string) => {
        const response = await deleteAccount(token);

        set({ auth: null });

        return response;
      },
      // Data Export
      requestDataExport: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await requestDataExport();

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
        const { auth, reloadAccount } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await cancelNewEmail();

        await reloadAccount();

        return response;
      },
      // Account
      reloadAccount: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await getAccount();

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
        const { reloadTheme } = useAppStore.getState();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await updateAccountSettings(data);

        set({ auth: response.data });

        sonnerToast.success('Settings updated', {
          description: 'Your settings have been updated.',
        });

        reloadTheme();

        return response;
      },
      uploadAccountAvatar: async (file: File) => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await uploadAccountAvatar(file);

        set({ auth: response.data });

        sonnerToast.success('Avatar updated', {
          description: 'Your avatar have been updated.',
        });

        return response;
      },
      deleteAccountAvatar: async () => {
        const { auth } = get();
        if (!auth?.userAccessToken?.token) {
          throw new Error('No token found');
        }

        const response = await deleteAccountAvatar();

        set({ auth: response.data });

        sonnerToast.success('Avatar deleted', {
          description: 'Your avatar have been deleted.',
        });

        return response;
      },
      // Account Password Settings Dialog
      accountPasswordSettingsDialogOpen: false,
      setAccountPasswordSettingsDialogOpen: (accountPasswordSettingsDialogOpen: boolean) => {
        set({ accountPasswordSettingsDialogOpen });
      },
      // Ping
      doPing: async () => {
        await doPing();
      },
    }),
    // App Data
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

          const { reloadAppData } = useAppStore.getState();

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
              await state.reloadAccount();
              await reloadAppData();
            } catch (error) {
              // Nothing to do
            }
          }, 0);
        };
      },
    }
  )
);

export const useAuthUserSetting = <K extends keyof UserSettings, F = null>(
  key: K,
  fallback: F = null as F
) => useAuthStore((state) => state.auth?.user?.settings?.[key] ?? fallback);

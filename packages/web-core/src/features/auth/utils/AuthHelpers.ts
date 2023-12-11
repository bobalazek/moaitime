import {
  API_URL,
  AuthInterface,
  ResponseInterface,
  UpdateUserInterface,
  UpdateUserPasswordInterface,
  UpdateUserSettingsInterface,
} from '@myzenbuddy/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const login = async (email: string, password: string) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const logout = async () => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/logout`,
    {
      method: 'POST',
    }
  );

  return response;
};

export const register = async (displayName: string, email: string, password: string) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify({ displayName, email, password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const resendEmailConfirmation = async (isNewEmail?: boolean) => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/resend-email-confirmation`,
    {
      method: 'POST',
      body: JSON.stringify({ isNewEmail }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const cancelNewEmail = async () => {
  const response = await fetchJson<ResponseInterface>(`${API_URL}/api/v1/auth/cancel-new-email`, {
    method: 'POST',
  });

  return response;
};

export const requestPasswordReset = async (email: string) => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/request-password-reset`,
    {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetchJson<ResponseInterface>(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response;
};

export const confirmEmail = async (token: string, isNewEmail?: boolean) => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/confirm-email`,
    {
      method: 'POST',
      body: JSON.stringify({ token, isNewEmail }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    {
      preventToast: true,
    }
  );

  return response;
};

export const refreshToken = async (token: string) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/refresh-token`,
    {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const loadAccount = async () => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/account`,
    {
      method: 'GET',
    }
  );

  return response;
};

export const updateAccount = async (data: UpdateUserInterface) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/account`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const updateAccountPassword = async (data: UpdateUserPasswordInterface) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/account/password`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};
export const updateAccountSettings = async (data: UpdateUserSettingsInterface) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/account/settings`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

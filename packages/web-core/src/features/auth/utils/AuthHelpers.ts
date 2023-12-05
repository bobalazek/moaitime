import {
  API_URL,
  AuthInterface,
  ResponseInterface,
  UpdateUserInterface,
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

export const resendEmailConfirmation = async () => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/resend-email-confirmation`,
    {
      method: 'POST',
    }
  );

  return response;
};

export const resendNewEmailConfirmation = async () => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/resend-new-email-confirmation`,
    {
      method: 'POST',
    }
  );

  return response;
};

export const cancelNewEmailConfirmation = async () => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/cancel-new-email-confirmation`,
    {
      method: 'POST',
    }
  );

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

export const me = async () => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(`${API_URL}/api/v1/auth/me`, {
    method: 'GET',
  });

  return response;
};

export const updateSettings = async (data: UpdateUserInterface) => {
  const response = await fetchJson<ResponseInterface<AuthInterface>>(
    `${API_URL}/api/v1/auth/settings`,
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

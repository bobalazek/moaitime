import {
  API_URL,
  Auth,
  ResponseInterface,
  UpdateUser,
  UpdateUserPassword,
  UpdateUserSettings,
  UserLimits,
  UserUsage,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const login = async (email: string, password: string) => {
  const response = await fetchJson<ResponseInterface<Auth>>(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response;
};

export const logout = async () => {
  const response = await fetchJson<ResponseInterface<Auth>>(`${API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response;
};

export const register = async (displayName: string, email: string, password: string) => {
  const data = {
    displayName,
    email,
    password,
    settings: {
      generalTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      clockUse24HourClock: !Intl.DateTimeFormat().resolvedOptions().hour12,
    },
  };

  const response = await fetchJson<ResponseInterface<Auth>>(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

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
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
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

export const requestAccountDeletion = async () => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/request-account-deletion`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

export const deleteAccount = async (token: string) => {
  const response = await fetchJson<ResponseInterface>(`${API_URL}/api/v1/auth/delete-account`, {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response;
};

export const requestDataExport = async () => {
  const response = await fetchJson<ResponseInterface>(
    `${API_URL}/api/v1/auth/request-data-export`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

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
  const response = await fetchJson<ResponseInterface<Auth>>(
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

export const getAccount = async () => {
  const response = await fetchJson<ResponseInterface<Auth>>(`${API_URL}/api/v1/auth/account`, {
    method: 'GET',
  });

  return response;
};

export const updateAccount = async (data: UpdateUser) => {
  const response = await fetchJson<ResponseInterface<Auth>>(`${API_URL}/api/v1/auth/account`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response;
};

export const updateAccountPassword = async (data: UpdateUserPassword) => {
  const response = await fetchJson<ResponseInterface<Auth>>(
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
export const updateAccountSettings = async (data: UpdateUserSettings) => {
  const response = await fetchJson<ResponseInterface<Auth>>(
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

// User Limits and Usage
export const getUserLimits = async () => {
  const response = await fetchJson<ResponseInterface<UserLimits>>(
    `${API_URL}/api/v1/auth/account/limits`,
    {
      method: 'GET',
    }
  );

  return response.data ?? null;
};

export const getUserUsage = async () => {
  const response = await fetchJson<ResponseInterface<UserUsage>>(
    `${API_URL}/api/v1/auth/account/usage`,
    {
      method: 'GET',
    }
  );

  return response.data ?? null;
};

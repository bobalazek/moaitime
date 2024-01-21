import {
  API_URL,
  CreateFocusSession,
  FocusSession,
  ResponseInterface,
  UpdateFocusSession,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Focus Sessions **********/
export const getFocusSession = async (focusSessionId: string): Promise<FocusSession | null> => {
  const response = await fetchJson<ResponseInterface<FocusSession | null>>(
    `${API_URL}/api/v1/focus-sessions/${focusSessionId}`,
    {
      method: 'GET',
    }
  );

  return response.data as FocusSession;
};

export const addFocusSession = async (focusSession: CreateFocusSession): Promise<FocusSession> => {
  const response = await fetchJson<ResponseInterface<FocusSession>>(
    `${API_URL}/api/v1/focus-sessions`,
    {
      method: 'POST',
      body: JSON.stringify(focusSession),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as FocusSession;
};

export const editFocusSession = async (
  focusSessionId: string,
  focusSession: UpdateFocusSession
): Promise<FocusSession> => {
  const response = await fetchJson<ResponseInterface<FocusSession>>(
    `${API_URL}/api/v1/focus-sessions/${focusSessionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(focusSession),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as FocusSession;
};

export const deleteFocusSession = async (
  focusSessionId: string,
  isHardDelete?: boolean
): Promise<FocusSession> => {
  const response = await fetchJson<ResponseInterface<FocusSession>>(
    `${API_URL}/api/v1/focus-sessions/${focusSessionId}`,
    {
      method: 'DELETE',
      body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as FocusSession;
};

export const undeleteFocusSession = async (focusSessionId: string): Promise<FocusSession> => {
  const response = await fetchJson<ResponseInterface<FocusSession>>(
    `${API_URL}/api/v1/focus-sessions/${focusSessionId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as FocusSession;
};

import {
  CreateFocusSession,
  FocusSession,
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  ResponseInterface,
  UpdateFocusSession,
} from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Focus Sessions **********/
export const getFocusSession = async (
  focusSessionId: string,
  updatePing?: boolean
): Promise<FocusSession | null> => {
  const url = new URL(`${API_URL}/api/v1/focus-sessions/${focusSessionId}`);
  if (updatePing) {
    url.searchParams.set('updatePing', 'true');
  }

  const response = await fetchJson<ResponseInterface<FocusSession | null>>(url.toString(), {
    method: 'GET',
  });

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

export const triggerFocusSessionAction = async (
  focusSessionId: string,
  action: FocusSessionUpdateActionEnum
): Promise<FocusSession> => {
  const response = await fetchJson<ResponseInterface<FocusSession>>(
    `${API_URL}/api/v1/focus-sessions/${focusSessionId}/${action}`,
    {
      method: 'POST',
    }
  );

  return response.data as FocusSession;
};

export const playStartFocusSessionSound = () => {
  const audio = new Audio();
  audio.src = '/assets/focus/start_focus_session.mp3';
  audio.play();
};

export const playChangeFocusSessionStageSound = () => {
  const audio = new Audio();
  audio.src = '/assets/focus/change_focus_session_stage.mp3';
  audio.play();
};

export const getTitleText = (remainingSecondsTimer: string, focusSession?: FocusSession) => {
  if (!focusSession || focusSession.completedAt) {
    return `Focus | MoaiTime`;
  }

  const stageText =
    focusSession.stage === FocusSessionStageEnum.FOCUS
      ? 'Focus'
      : focusSession.stage === FocusSessionStageEnum.LONG_BREAK
        ? 'Long Break'
        : 'Short Break';

  if (focusSession.status === FocusSessionStatusEnum.PAUSED) {
    return `Paused | ${stageText} | MoaiTime`;
  }

  return `${remainingSecondsTimer} | ${stageText} | MoaiTime`;
};

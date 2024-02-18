import { QueryClient } from '@tanstack/react-query';

import { sonnerToast } from '@moaitime/web-ui';

import { APP_VERSION_HEADER } from '../../../../../shared-common/src/Constants';
import { useAuthStore } from '../../auth/state/authStore';
import { ErrorResponse } from '../errors/ErrorResponse';

export const queryClient = new QueryClient();

let _appVersion: string | null = null;
export const fetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  options?: { preventToast?: boolean }
): Promise<T> => {
  const { auth, logout } = useAuthStore.getState();

  if (!init) {
    init = {};
  }

  if (!init?.headers) {
    init.headers = {};
  }

  const userAgent = navigator.userAgent;
  const deviceUid = getDeviceUid();

  init.headers = {
    ...init.headers,
    'user-agent': userAgent,
    'device-uid': deviceUid,
  };

  if (auth?.userAccessToken?.token) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${auth.userAccessToken.token}`,
    };
  }

  const response = await fetch(input, init);
  const data = await response.json();

  if (!response.ok) {
    if (data.statusCode === 401) {
      await logout();
    }

    if (data.error && !options?.preventToast) {
      sonnerToast.error('Oops!', {
        description: data.error ?? 'Something went wrong.',
      });
    }

    throw new ErrorResponse(data);
  }

  const requestAppVersion = response.headers.get(APP_VERSION_HEADER);
  if (requestAppVersion) {
    if (_appVersion && _appVersion !== requestAppVersion) {
      sonnerToast.error('App Update', {
        description: 'The app has been updated. Please refresh the page.',
        action: {
          label: 'Refresh',
          onClick: () => {
            window.location.reload();
          },
        },
      });
    }

    _appVersion = response.headers.get(APP_VERSION_HEADER);
  }

  return data;
};

export const getDeviceUid = (): string => {
  let deviceUid = localStorage.getItem('device-uid');
  if (!deviceUid) {
    deviceUid = `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('device-uid', deviceUid);
  }

  return deviceUid;
};

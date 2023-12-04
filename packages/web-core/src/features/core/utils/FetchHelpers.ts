import { toast } from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../auth/state/authStore';
import { ErrorResponse } from '../errors/ErrorResponse';

export const fetchJson = async <T>(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<T> => {
  const { auth, logout } = useAuthStore.getState();
  if (auth?.userAccessToken?.token) {
    if (!init) {
      init = {};
    }

    if (!init.headers) {
      init.headers = {};
    }

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

    if (data.error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: data.error ?? 'Something went wrong while trying to register',
      });
    }

    throw new ErrorResponse(data);
  }

  return data;
};

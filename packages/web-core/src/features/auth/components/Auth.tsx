import { useEffect } from 'react';

import { useAuthStore } from '../state/authStore';

export default function Auth() {
  const { reloadAccount } = useAuthStore();

  useEffect(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      try {
        await reloadAccount();
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  return null;
}

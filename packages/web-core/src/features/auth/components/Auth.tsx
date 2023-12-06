import { useEffect } from 'react';

import { useAuthStore } from '../state/authStore';

export default function Auth() {
  const { me } = useAuthStore();

  useEffect(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      await me();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  return null;
}

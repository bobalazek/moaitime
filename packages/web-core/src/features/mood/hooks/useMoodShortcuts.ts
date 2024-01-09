import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useMoodShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const openDialogs = document.querySelectorAll('[role="dialog"]');
      if (openDialogs.length > 0) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();

        navigate('/');
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

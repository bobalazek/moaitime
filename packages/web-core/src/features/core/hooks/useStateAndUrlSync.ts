import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useStateAndUrlSync = (updateStateByUrl: () => void, targetUri: string) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onPopState = () => {
      updateStateByUrl();
    };

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [updateStateByUrl]);

  useEffect(() => {
    const currentUri = `${location.pathname}${location.search}`;
    if (currentUri !== targetUri) {
      // If we visit a page such as /calendar, we basically always get
      // instantly redirectedto something like /calendar/{view}?selectedDate={date}
      // In that case, we really don't ever need to go back to /calendar, so we can
      // replace the current history entry with the new one.
      const replace = currentUri !== '/' && targetUri.startsWith(currentUri);

      navigate(targetUri, {
        replace,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUri]);
};

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCalendarStore } from '../state/calendarStore';

export const useCalendarStateAndUrlSync = (updateStateByUrl: () => void) => {
  const { selectedView, selectedDate } = useCalendarStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [targetUri, setTargetUri] = useState(location.pathname);

  // If URL changes
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
      navigate(targetUri);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUri]);

  // If State changes
  useEffect(() => {
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    const newTargetUri = `/calendar/${selectedView}?selectedDate=${selectedDateString}`;

    setTargetUri(newTargetUri);
  }, [setTargetUri, selectedView, selectedDate, targetUri]);
};

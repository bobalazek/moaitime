import { RefObject, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { calendarViewOptions } from '@moaitime/shared-common';

import { CalendarDialogHeaderRef } from '../components/pages/calendar/CalendarPageHeader';
import { useCalendarStore } from '../state/calendarStore';

export const useCalendarShortcuts = (headerRef: RefObject<CalendarDialogHeaderRef>) => {
  const { setSelectedDateAndView } = useCalendarStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const openDialogs = document.querySelectorAll('[role="dialog"]');
      if (openDialogs.length > 0) {
        return;
      }

      const selectedViewByKey = calendarViewOptions.find(
        (option) => option.keyboardShortcutKey === event.key
      )?.value;
      if (selectedViewByKey) {
        event.preventDefault();

        setSelectedDateAndView(new Date(), selectedViewByKey);
      } else if (event.key === 'Escape') {
        event.preventDefault();

        navigate('/');
      } else if (event.key === 'PageUp') {
        event.preventDefault();

        headerRef.current?.onPrevButtonClick();
      } else if (event.key === 'PageDown') {
        event.preventDefault();

        headerRef.current?.onNextButtonClick();
      } else if (event.key === 'Home') {
        event.preventDefault();

        headerRef.current?.onTodayButtonClick();
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

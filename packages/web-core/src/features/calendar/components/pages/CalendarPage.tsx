import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { CalendarViewEnum } from '@moaitime/shared-common';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useStateAndUrlSync } from '../../../core/hooks/useStateAndUrlSync';
import { useCalendarShortcuts } from '../../hooks/useCalendarShortcuts';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarAgendaView from '../views/CalendarAgendaView';
import CalendarDailyView from '../views/CalendarDailyView';
import CalendarMonthlyView from '../views/CalendarMonthlyView';
import CalendarWeeklyView from '../views/CalendarWeeklyView';
import CalendarYearlyView from '../views/CalendarYearlyView';
import CalendarPageHeader, { CalendarDialogHeaderRef } from './calendar/CalendarPageHeader';

export default function CalendarPage() {
  const {
    selectedView,
    selectedDate,
    setSelectedView,
    setSelectedDate,
    reloadCalendars,
    reloadUserCalendars,
    reloadSelectedDays,
  } = useCalendarStore();
  const location = useLocation();
  const [targetUri, setTargetUri] = useState(`${location.pathname}${location.search}`);
  const headerRef = useRef<CalendarDialogHeaderRef>(null); // Not sure why we couldn't just use typeof CalendarDialogHeader
  const isInitializedRef = useRef(false); // Prevents react to trigger useEffect twice

  useEffect(() => {
    document.title = 'Calendar | MoaiTime';
  }, []);

  const updateStateByUrl = useDebouncedCallback(() => {
    const newSelectedView = location.pathname.replace('/calendar/', '') as CalendarViewEnum;
    if (
      Object.values(CalendarViewEnum).includes(newSelectedView) &&
      newSelectedView !== selectedView
    ) {
      setSelectedView(newSelectedView);
    }

    const params = new URLSearchParams(location.search);
    const newSelectedDate = params.get('selectedDate');
    if (newSelectedDate && newSelectedDate !== format(selectedDate, 'yyyy-MM-dd')) {
      setSelectedDate(new Date(newSelectedDate));
    }
  }, 10);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    updateStateByUrl();
    reloadCalendars();
    reloadUserCalendars();
    reloadSelectedDays();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    const newTargetUri = `/calendar/${selectedView}?selectedDate=${selectedDateString}`;

    setTargetUri(newTargetUri);
  }, [setTargetUri, selectedView, selectedDate]);

  useStateAndUrlSync(updateStateByUrl, targetUri);
  useCalendarShortcuts(headerRef);

  return (
    <ErrorBoundary>
      <div
        id="calendar"
        className="flex h-screen max-w-none flex-col overflow-auto"
        data-test="calendar"
      >
        <div className="pb-2">
          <CalendarPageHeader ref={headerRef} />
        </div>
        <div className="flex flex-grow p-4">
          {selectedView === CalendarViewEnum.DAY && <CalendarDailyView />}
          {selectedView === CalendarViewEnum.WEEK && <CalendarWeeklyView />}
          {selectedView === CalendarViewEnum.MONTH && <CalendarMonthlyView />}
          {selectedView === CalendarViewEnum.YEAR && <CalendarYearlyView />}
          {selectedView === CalendarViewEnum.AGENDA && <CalendarAgendaView />}
        </div>
      </div>
    </ErrorBoundary>
  );
}

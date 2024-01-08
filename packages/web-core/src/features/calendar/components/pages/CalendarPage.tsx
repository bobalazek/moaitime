import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { CalendarViewEnum } from '@moaitime/shared-common';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useCalendarShortcuts } from '../../hooks/useCalendarShortcuts';
import { useCalendarStateAndUrlSync } from '../../hooks/useCalendarStateAndUrlSync';
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
    loadCalendars,
    reloadSelectedDays,
  } = useCalendarStore();
  const headerRef = useRef<CalendarDialogHeaderRef>(null); // Not sure why we couldn't just use typeof CalendarDialogHeader
  const isInitializedRef = useRef(false); // Prevents react to trigger useEffect twice

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
  }, 50);

  useCalendarShortcuts(headerRef);
  useCalendarStateAndUrlSync(updateStateByUrl);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    updateStateByUrl();
    loadCalendars();
    reloadSelectedDays();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex h-screen max-w-none flex-col overflow-auto" data-test="calendar">
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

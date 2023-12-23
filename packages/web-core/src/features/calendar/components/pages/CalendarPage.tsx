import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { CalendarViewEnum, calendarViewOptions } from '@moaitime/shared-common';

import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarDeleteAlertDialog from '../calendar-delete-alert-dialog/CalendarDeleteAlertDialog';
import CalendarEditDialog from '../calendar-edit-dialog/CalendarEditDialog';
import CalendarEntryEditDialog from '../calendar-entry-edit-dialog/CalendarEntryEditDialog';
import DeletedCalendarsDialog from '../deleted-calendars-dialog/DeletedCalendarsDialog';
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
    settingsSheetOpen,
    selectedCalendarDialogOpen,
    selectedCalendarEntryDialogOpen,
    setSelectedView,
    setSelectedDate,
    loadCalendars,
    reloadSelectedDays,
  } = useCalendarStore();
  const headerRef = useRef<CalendarDialogHeaderRef>(null); // Not sure why we couldn't just use typeof CalendarDialogHeader
  const isInitialized = useRef(false); // Prevents react to trigger useEffect twice
  const navigate = useNavigate();
  const { pathname, search, key } = useLocation();
  const [targetPathname, setTargetPathname] = useState(pathname);

  const updateStateByUrl = useDebouncedCallback(() => {
    const newSelectedView = pathname.replace('/calendar/', '') as CalendarViewEnum;
    if (
      Object.values(CalendarViewEnum).includes(newSelectedView) &&
      newSelectedView !== selectedView
    ) {
      setSelectedView(newSelectedView);
    }

    const params = new URLSearchParams(search);
    const newSelectedDate = params.get('selectedDate');
    if (newSelectedDate && newSelectedDate !== format(selectedDate, 'yyyy-MM-dd')) {
      setSelectedDate(new Date(newSelectedDate));
    }
  }, 100);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    updateStateByUrl();
    loadCalendars();
    reloadSelectedDays();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If URL changes
  useEffect(() => {
    updateStateByUrl();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search, key]);

  useEffect(() => {
    if (pathname !== targetPathname) {
      navigate(targetPathname);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPathname]);

  // If State changes
  useEffect(() => {
    setTargetPathname(
      `/calendar/${selectedView}?selectedDate=${format(selectedDate, 'yyyy-MM-dd')}`
    );
  }, [setTargetPathname, selectedView, selectedDate]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (settingsSheetOpen || selectedCalendarDialogOpen || selectedCalendarEntryDialogOpen) {
        return;
      }

      const selectedViewByKey = calendarViewOptions.find(
        (option) => option.keyboardShortcutKey === event.key
      )?.value;
      if (selectedViewByKey) {
        event.preventDefault();

        setSelectedDate(new Date());
        setSelectedView(selectedViewByKey);
      } else if (event.key === 'PageUp') {
        event.preventDefault();

        headerRef.current?.onPrevButtonClick();
      } else if (event.key === 'PageDown') {
        event.preventDefault();

        headerRef.current?.onNextButtonClick();
      } else if (event.key === 'Home') {
        event.preventDefault();

        headerRef.current?.onTodayButtonClick();
      } else if (event.key === 'Escape') {
        event.preventDefault();

        navigate('/');
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsSheetOpen, selectedCalendarDialogOpen, selectedCalendarEntryDialogOpen]);

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
      <CalendarEditDialog />
      <CalendarEntryEditDialog />
      <DeletedCalendarsDialog />
      <CalendarDeleteAlertDialog />
    </ErrorBoundary>
  );
}

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    loadCalendars();
    reloadSelectedDays();
  }, [loadCalendars, reloadSelectedDays]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (settingsSheetOpen || selectedCalendarDialogOpen || selectedCalendarEntryDialogOpen) {
        return;
      }

      const selectedViewByKey = calendarViewOptions.find(
        (option) => option.keyboardShortcutKey === e.key
      )?.value;
      if (selectedViewByKey) {
        e.preventDefault();

        setSelectedDate(new Date());
        setSelectedView(selectedViewByKey);
      } else if (e.key === 'PageUp') {
        e.preventDefault();

        headerRef.current?.onPrevButtonClick();
      } else if (e.key === 'PageDown') {
        e.preventDefault();

        headerRef.current?.onNextButtonClick();
      } else if (e.key === 'Home') {
        e.preventDefault();

        headerRef.current?.onTodayButtonClick();
      } else if (e.key === 'Escape') {
        e.preventDefault();

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

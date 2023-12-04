import { useEffect, useRef } from 'react';

import { CalendarViewEnum, calendarViewOptions } from '@myzenbuddy/shared-common';
import { Dialog, DialogContent, DialogHeader } from '@myzenbuddy/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarDailyView from '../views/CalendarDailyView';
import CalendarMonthlyView from '../views/CalendarMonthlyView';
import CalendarWeeklyView from '../views/CalendarWeeklyView';
import CalendarYearlyView from '../views/CalendarYearlyView';
import CalendarDialogHeader, { CalendarDialogHeaderRef } from './CalendarDialogHeader';

export default function CalendarDialog() {
  const { dialogOpen, selectedView, setDialogOpen, setSelectedView, setSelectedDate } =
    useCalendarStore();
  const headerRef = useRef<CalendarDialogHeaderRef>(null); // Not sure why we couldn't just use typeof CalendarDialogHeader

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (!dialogOpen) {
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
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        className="flex h-screen max-w-none flex-col overflow-auto p-4"
        data-test="calendar--dialog"
      >
        <DialogHeader>
          <CalendarDialogHeader ref={headerRef} />
        </DialogHeader>
        <div className="flex flex-grow">
          {selectedView === CalendarViewEnum.DAY && <CalendarDailyView />}
          {selectedView === CalendarViewEnum.WEEK && <CalendarWeeklyView />}
          {selectedView === CalendarViewEnum.MONTH && <CalendarMonthlyView />}
          {selectedView === CalendarViewEnum.YEAR && <CalendarYearlyView />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

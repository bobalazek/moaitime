import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { forwardRef, useImperativeHandle } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { CalendarViewEnum } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarDialogHeaderCalendar from './CalendarDialogHeaderCalendar';
import CalendarDialogHeaderText from './CalendarDialogHeaderText';
import CalendarDialogHeaderTodayButtonText from './CalendarDialogHeaderTodayButtonText';
import CalendarDialogHeaderViewSelector from './CalendarDialogHeaderViewSelector';

export interface CalendarDialogHeaderRef {
  onPrevButtonClick: () => void;
  onTodayButtonClick: () => void;
  onNextButtonClick: () => void;
}

const CalendarDialogHeader = forwardRef<CalendarDialogHeaderRef>((_, ref) => {
  const { setSelectedDate, selectedDate, selectedView, isTodayInSelectedDaysRange } =
    useCalendarStore();

  const onPrevButtonClick = () => {
    if (selectedView === CalendarViewEnum.DAY) {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (selectedView === CalendarViewEnum.WEEK) {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else if (selectedView === CalendarViewEnum.MONTH) {
      setSelectedDate(subMonths(selectedDate, 1));
    } else if (selectedView === CalendarViewEnum.YEAR) {
      setSelectedDate(subYears(selectedDate, 1));
    }
  };

  const onTodayButtonClick = () => {
    setSelectedDate(new Date());
  };

  const onNextButtonClick = () => {
    if (selectedView === CalendarViewEnum.DAY) {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (selectedView === CalendarViewEnum.WEEK) {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else if (selectedView === CalendarViewEnum.MONTH) {
      setSelectedDate(addMonths(selectedDate, 1));
    } else if (selectedView === CalendarViewEnum.YEAR) {
      setSelectedDate(addYears(selectedDate, 1));
    }
  };

  useImperativeHandle(ref, () => ({
    onPrevButtonClick,
    onTodayButtonClick,
    onNextButtonClick,
  }));

  return (
    <div
      className="items-center gap-4 text-center text-2xl md:flex md:justify-between md:pr-8"
      data-test="calendar--dialog--header"
    >
      <CalendarDialogHeaderText />
      <div className="mt-2 flex justify-center gap-2 md:mt-0 md:flex">
        <CalendarDialogHeaderCalendar />
        <Button
          className="border"
          variant="ghost"
          size="sm"
          onClick={onPrevButtonClick}
          data-test="calendar--dialog--header--prev-button"
        >
          <FaAngleLeft />
        </Button>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          onClick={onNextButtonClick}
          data-test="calendar--dialog--header--next-button"
        >
          <FaAngleRight />
        </Button>
        <Button
          className="border"
          variant="outline"
          size="sm"
          onClick={onTodayButtonClick}
          disabled={isTodayInSelectedDaysRange}
          data-test="calendar--dialog--header--today-button"
        >
          <CalendarDialogHeaderTodayButtonText />
        </Button>
        <CalendarDialogHeaderViewSelector />
      </div>
    </div>
  );
});

export default CalendarDialogHeader;

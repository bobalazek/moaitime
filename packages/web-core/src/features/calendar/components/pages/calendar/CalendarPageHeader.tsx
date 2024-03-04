import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isToday,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle } from 'react';

import { CalendarViewEnum } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import { useCalendarStore } from '../../../state/calendarStore';
import CalendarSettingsDialog from '../../calendar-settings-dialog/CalendarSettingsDialog';
import CalendarPageHeaderCalendar from './CalendarPageHeaderCalendar';
import CalendarPageHeaderText from './CalendarPageHeaderText';
import CalendarPageHeaderTodayButtonText from './CalendarPageHeaderTodayButtonText';
import CalendarPageHeaderViewSelector from './CalendarPageHeaderViewSelector';

export interface CalendarDialogHeaderRef {
  onPrevButtonClick: () => void;
  onTodayButtonClick: () => void;
  onNextButtonClick: () => void;
}

const CalendarPageHeader = forwardRef<CalendarDialogHeaderRef>((_, ref) => {
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
    } else if (selectedView === CalendarViewEnum.AGENDA) {
      setSelectedDate(subMonths(selectedDate, 3));
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
    } else if (selectedView === CalendarViewEnum.AGENDA) {
      setSelectedDate(addMonths(selectedDate, 3));
    }
  };

  useImperativeHandle(ref, () => ({
    onPrevButtonClick,
    onTodayButtonClick,
    onNextButtonClick,
  }));

  const isTodayButtonDisabled =
    selectedView === CalendarViewEnum.AGENDA ? isToday(selectedDate) : isTodayInSelectedDaysRange;

  return (
    <LayoutPageHeader testKey="calendar" title={<CalendarPageHeaderText />}>
      <div className="mt-2 justify-end gap-2 sm:flex md:mt-0">
        <CalendarSettingsDialog />
        <CalendarPageHeaderCalendar />
        <Button
          className="border"
          variant="ghost"
          size="sm"
          onClick={onPrevButtonClick}
          title="Previous date range"
          data-test="calendar--header--prev-button"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          onClick={onNextButtonClick}
          title="Next date range"
          data-test="calendar--header--next-button"
        >
          <ArrowRightIcon />
        </Button>
        <Button
          className="border"
          variant="outline"
          size="sm"
          onClick={onTodayButtonClick}
          disabled={isTodayButtonDisabled}
          title="Go to today"
          data-test="calendar--header--today-button"
        >
          <CalendarPageHeaderTodayButtonText />
        </Button>
        <CalendarPageHeaderViewSelector />
      </div>
    </LayoutPageHeader>
  );
});

export default CalendarPageHeader;

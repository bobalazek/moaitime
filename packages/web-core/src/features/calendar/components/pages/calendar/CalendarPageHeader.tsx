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
import { useSetAtom } from 'jotai';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CogIcon,
  MoreVerticalIcon,
} from 'lucide-react';
import { forwardRef, useImperativeHandle } from 'react';
import { isMobile } from 'react-device-detect';

import { CalendarViewEnum } from '@moaitime/shared-common';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import LayoutPageHeader from '../../../../core/components/layout/LayoutPageHeader';
import { calendarCalendarDialogOpenAtom } from '../../../state/calendarAtoms';
import { useCalendarStore } from '../../../state/calendarStore';
import CalendarCalendarDialog from '../../calendar-calendar/CalendarCalendarDialog';
import CalendarCalendarPopover from '../../calendar-calendar/CalendarCalendarPopover';
import CalendarSettingsDialog from '../../calendar-settings-dialog/CalendarSettingsDialog';
import CalendarPageHeaderText from './CalendarPageHeaderText';
import CalendarPageHeaderTodayButtonText from './CalendarPageHeaderTodayButtonText';
import CalendarPageHeaderViewSelector from './CalendarPageHeaderViewSelector';

export interface CalendarDialogHeaderRef {
  onPrevButtonClick: () => void;
  onTodayButtonClick: () => void;
  onNextButtonClick: () => void;
}

const CalendarPageHeader = forwardRef<CalendarDialogHeaderRef>((_, ref) => {
  const {
    setSelectedDate,
    setSettingsDialogOpen,
    selectedDate,
    selectedView,
    isTodayInSelectedDaysRange,
  } = useCalendarStore();
  const setCalendarCalendarDialogOpen = useSetAtom(calendarCalendarDialogOpenAtom);

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

  const onOpenCalendarButtonClick = () => {
    setCalendarCalendarDialogOpen(true);
  };

  const onSettingsButtonClick = () => {
    setSettingsDialogOpen(true);
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
      <div className="flex flex-wrap justify-center gap-2 md:mt-0">
        {!isMobile && (
          <>
            <CalendarSettingsDialog includeTrigger />
            <CalendarCalendarPopover />
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
          </>
        )}
        {isMobile && (
          <>
            <CalendarSettingsDialog />
            <CalendarCalendarDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full p-1 text-sm"
                  data-test="calendar--header--dropdown-menu--trigger-button"
                >
                  <MoreVerticalIcon className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent data-test="calendar--header--dropdown-menu">
                <DropdownMenuItem className="cursor-pointer" onClick={onOpenCalendarButtonClick}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Open Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={onSettingsButtonClick}>
                  <CogIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CalendarPageHeaderViewSelector />
          </>
        )}
      </div>
    </LayoutPageHeader>
  );
});

export default CalendarPageHeader;

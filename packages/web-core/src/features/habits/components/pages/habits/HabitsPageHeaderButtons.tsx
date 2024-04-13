import { addDays } from 'date-fns';
import { useSetAtom } from 'jotai';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CogIcon,
  MoreVerticalIcon,
  PlusIcon,
} from 'lucide-react';
import { isMobile } from 'react-device-detect';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { habitsCalendarDialogOpenAtom } from '../../../state/habitsAtoms';
import { useHabitsStore } from '../../../state/habitsStore';
import HabitsCalendarDialog from '../../habits-calendar/HabitsCalendarDialog';
import HabitsCalendarPopover from '../../habits-calendar/HabitsCalendarPopover';
import HabitsSettingsDialog from '../../habits-settings-dialog/HabitsSettingsDialog';

const HabitsPageHeaderButtons = () => {
  const { selectedDate, setSettingsDialogOpen, setSelectedDate, setSelectedHabitDialogOpen } =
    useHabitsStore();
  const setHabitsCalendarDialogOpen = useSetAtom(habitsCalendarDialogOpenAtom);

  const onPrevButtonClick = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const onNextButtonClick = () => {
    setSelectedDate(addDays(selectedDate, +1));
  };

  const onTodayButtonClick = () => {
    setSelectedDate(new Date());
  };

  const onAddHabitButtonClick = () => {
    setSelectedHabitDialogOpen(true, null);
  };

  const onOpenCalendarButtonClick = () => {
    setHabitsCalendarDialogOpen(true);
  };

  const onSettingsButtonClick = () => {
    setSettingsDialogOpen(true);
  };

  const isTodayButtonDisabled = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-wrap justify-center gap-2 md:mt-0">
      {!isMobile && (
        <>
          <HabitsSettingsDialog includeTrigger />
          <HabitsCalendarPopover />
          <Button
            className="border"
            variant="ghost"
            size="sm"
            onClick={onPrevButtonClick}
            title="Previous date range"
            data-test="habits--header--prev-button"
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            className="border"
            variant="ghost"
            size="sm"
            onClick={onNextButtonClick}
            title="Next date range"
            data-test="habits--header--next-button"
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
            data-test="habits--header--today-button"
          >
            Today
          </Button>
        </>
      )}
      {isMobile && (
        <>
          <HabitsSettingsDialog />
          <HabitsCalendarDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full p-1 text-sm"
                data-test="habits--header--dropdown-menu--trigger-button"
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent data-test="habits--header--dropdown-menu">
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
        </>
      )}
      <Button
        size="sm"
        variant="default"
        onClick={onAddHabitButtonClick}
        data-test="habits--header--add-new-habit-button"
      >
        <PlusIcon size={24} />
      </Button>
    </div>
  );
};

export default HabitsPageHeaderButtons;

import { addDays } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from 'lucide-react';

import { Button } from '@moaitime/web-ui';

import { useHabitsStore } from '../../../state/habitsStore';
import HabitsSettingsDialog from '../../habits-settings-dialog/HabitsSettingsDialog';
import HabitsPageHeaderCalendar from './HabitsPageHeaderCalendar';

const HabitsPageHeaderButtons = () => {
  const { selectedDate, setSelectedDate, setSelectedHabitDialogOpen } = useHabitsStore();

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

  const isTodayButtonDisabled = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-wrap justify-center gap-2 md:mt-0">
      <HabitsSettingsDialog />
      <HabitsPageHeaderCalendar />
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

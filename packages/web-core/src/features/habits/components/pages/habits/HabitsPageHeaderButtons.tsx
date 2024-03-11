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

  const onAddHabitButtonClick = () => {
    setSelectedHabitDialogOpen(true, null);
  };

  return (
    <div className="flex gap-2">
      <HabitsSettingsDialog />
      <HabitsPageHeaderCalendar />
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

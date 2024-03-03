import { PlusIcon } from 'lucide-react';

import { Button } from '@moaitime/web-ui';

import { useHabitsStore } from '../../../state/habitsStore';

const HabitsPageHeaderButtons = () => {
  const { setSelectedHabitDialogOpen } = useHabitsStore();

  const onAddHabitButtonClick = () => {
    setSelectedHabitDialogOpen(true, null);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="default"
        className="h-8"
        onClick={onAddHabitButtonClick}
        data-test="habits--header--add-new-habit-button"
      >
        <PlusIcon size={24} />
      </Button>
    </div>
  );
};

export default HabitsPageHeaderButtons;

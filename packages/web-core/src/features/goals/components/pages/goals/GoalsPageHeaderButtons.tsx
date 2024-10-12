import { PlusIcon } from 'lucide-react';

import { Button } from '@moaitime/web-ui';

import { useGoalsStore } from '../../../state/goalsStore';

const GoalsPageHeaderButtons = () => {
  const { setSelectedGoalDialogOpen } = useGoalsStore();

  const onAddGoalButtonClick = () => {
    setSelectedGoalDialogOpen(true, null);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="default"
        className="h-8"
        onClick={onAddGoalButtonClick}
        data-test="goals--header--add-new-goal-button"
      >
        <PlusIcon size={24} />
      </Button>
    </div>
  );
};

export default GoalsPageHeaderButtons;

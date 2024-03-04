import { MinusIcon, PlusIcon } from 'lucide-react';

import { Habit } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';

export default function HabitEntry({
  habit,
  date,
  currentAmount,
}: {
  habit: Habit;
  date: string;
  currentAmount: number;
}) {
  const { updateHabitDaily } = useHabitsStore();

  const hasReachedGoal = currentAmount >= habit.goalAmount;

  const onDecrementButtonClick = async () => {
    await updateHabitDaily(habit.id, date, currentAmount - 1);
  };

  const onIncrementButtonClick = async () => {
    await updateHabitDaily(habit.id, date, currentAmount + 1);
  };

  return (
    <div
      className="rounded-lg border-2 px-6 py-4 text-left"
      style={{
        borderColor: habit.color ?? undefined,
        backgroundColor: hasReachedGoal ? habit.color ?? undefined : undefined,
      }}
    >
      <div className="flex w-full items-center justify-between ">
        <div>
          <h5 className="text-xl font-bold">{habit.name}</h5>
          {habit.description && (
            <div className="text-muted-foreground text-sm">{habit.description}</div>
          )}
        </div>
        <div className="flex gap-4">
          <Button onClick={onDecrementButtonClick} variant="outline">
            <MinusIcon size={24} />
          </Button>
          <div>
            {currentAmount}/{habit.goalAmount} {habit.goalFrequency}
          </div>
          <Button onClick={onIncrementButtonClick} variant="outline">
            <PlusIcon size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

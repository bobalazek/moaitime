import { PencilIcon } from 'lucide-react';

import { Habit } from '@moaitime/shared-common';

import { useHabitsStore } from '../../state/habitsStore';

export default function HabitEntry({ habit }: { habit: Habit }) {
  const { setSelectedHabitDialogOpen } = useHabitsStore();

  const onHabitButtonClick = async () => {
    setSelectedHabitDialogOpen(true, habit);
  };

  return (
    <div
      className="rounded-lg border-2 p-2 text-left"
      style={{
        borderColor: habit.color ?? undefined,
      }}
    >
      <div className="flex justify-between">
        <div className="flex w-full justify-between">
          <h5 className="text-lg font-bold">{habit.name}</h5>
          <button onClick={onHabitButtonClick}>
            <PencilIcon size={16} />
          </button>
        </div>
      </div>
      {habit.description && (
        <div className="text-muted-foreground text-xs">{habit.description}</div>
      )}
    </div>
  );
}

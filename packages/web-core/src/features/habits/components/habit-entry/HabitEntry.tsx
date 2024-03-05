import { MinusIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Habit } from '@moaitime/shared-common';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';

export type HabitEntryProps = {
  habit: Habit;
  date: string;
  currentAmount: number;
};

const HabbitEntryEditPopover = ({ habit, date, currentAmount }: HabitEntryProps) => {
  const { updateHabitDaily } = useHabitsStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentAmount ?? 0);

  const onSaveButtonClick = async () => {
    await updateHabitDaily(habit.id, date, value);

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PencilIcon size={16} />
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-auto flex-col gap-4 p-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(parseInt(e.target.value));
          }}
        />
        <Button onClick={onSaveButtonClick} variant="outline" size="sm">
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default function HabitEntry({ habit, date, currentAmount }: HabitEntryProps) {
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
      className="flex w-full flex-col flex-wrap rounded-lg border-2 px-6 py-4 text-left"
      style={{
        borderColor: habit.color ?? undefined,
        backgroundColor: hasReachedGoal ? habit.color ?? undefined : undefined,
      }}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex flex-grow">
          <div className="w-full">
            <h5 className="text-xl font-bold">{habit.name}</h5>
            {habit.description && (
              <div className="text-muted-foreground text-sm">{habit.description}</div>
            )}
          </div>
        </div>
        <div className="flex flex-shrink">
          <div className="flex flex-row flex-wrap items-center gap-4">
            <Button onClick={onDecrementButtonClick} variant="outline" size="sm">
              <MinusIcon size={24} />
            </Button>
            <div className="flex select-none items-center gap-1">
              <span className="text-2xl font-bold">{currentAmount}</span>
              <HabbitEntryEditPopover habit={habit} date={date} currentAmount={currentAmount} />
              <span>/</span>
              <span>{habit.goalAmount}</span>
              <span>{habit.goalUnit}</span>
            </div>
            <Button onClick={onIncrementButtonClick} variant="outline" size="sm">
              <PlusIcon size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

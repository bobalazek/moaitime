import { MinusIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { HabitDaily } from '@moaitime/shared-common';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';

export type HabitDailyEntryProps = {
  habitDaily: HabitDaily;
};

const HabbitDailyEntryEditPopover = ({ habitDaily }: HabitDailyEntryProps) => {
  const { updateHabitDaily } = useHabitsStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(habitDaily.amount?.toString() ?? '');

  useEffect(() => {
    setValue(habitDaily.amount?.toString() ?? '');
  }, [habitDaily.amount]);

  const onSaveButtonClick = async () => {
    await updateHabitDaily(habitDaily.habit.id, habitDaily.date, parseInt(value));

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        <PencilIcon size={16} />
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-auto flex-col gap-4 p-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              onSaveButtonClick();
            }
          }}
        />
        <Button onClick={onSaveButtonClick} variant="outline" size="sm">
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default function HabitDailyEntry({ habitDaily }: HabitDailyEntryProps) {
  const { updateHabitDaily } = useHabitsStore();
  const [currentAmount, setCurrentAmount] = useState(habitDaily.amount);

  const habit = habitDaily.habit;
  const date = habitDaily.date;
  const hasReachedGoal = currentAmount >= habitDaily.habit.goalAmount;

  let goalPercentage = currentAmount === 0 ? 0 : (currentAmount / habit.goalAmount) * 100;
  if (goalPercentage > 100) {
    goalPercentage = 100;
  }

  const debouncedUpdateHabitDaily = useDebouncedCallback((newAmount) => {
    updateHabitDaily(habit.id, date, newAmount);
  }, 500);

  const onDecrementButtonClick = async () => {
    let newAmount = currentAmount - 1;
    if (currentAmount <= 0) {
      newAmount = 0;
    }

    setCurrentAmount(newAmount);

    debouncedUpdateHabitDaily(newAmount);
  };

  const onIncrementButtonClick = async () => {
    const newAmount = currentAmount + 1;

    setCurrentAmount(newAmount);

    debouncedUpdateHabitDaily(newAmount);
  };

  useEffect(() => {
    setCurrentAmount(habitDaily.amount);
  }, [habitDaily.amount]);

  return (
    <div
      className="relative flex w-full flex-col flex-wrap rounded-lg border-2 px-6 py-4"
      style={{
        borderColor: habit.color ?? undefined,
        backgroundColor: hasReachedGoal ? habit.color ?? undefined : undefined,
      }}
    >
      <div
        className="bg-secondary absolute left-0 top-0 h-full rounded-md transition-all"
        style={{
          width: `${goalPercentage}%`,
          backgroundColor: habit.color ?? undefined,
        }}
      />
      <div className="z-10 flex w-full flex-wrap items-center justify-between gap-2">
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
              <HabbitDailyEntryEditPopover habitDaily={habitDaily} />
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

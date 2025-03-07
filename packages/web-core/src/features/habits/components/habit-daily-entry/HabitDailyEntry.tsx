import { MinusIcon, PencilIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { HabitDaily } from '@moaitime/shared-common';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import {
  getDarkerBackgroundColor,
  getLighterBackgroundColor,
  getTextColor,
} from '../../../core/utils/ColorHelpers';
import { useHabitsStore } from '../../state/habitsStore';

export type HabitDailyEntryProps = {
  habitDaily: HabitDaily;
};

const HabitDailyEntryEditPopover = ({ habitDaily }: HabitDailyEntryProps) => {
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
      <PopoverContent className="p-0" align="end">
        <div className="flex w-auto flex-col gap-4 p-2">
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function HabitDailyEntry({ habitDaily }: HabitDailyEntryProps) {
  const { updateHabitDaily } = useHabitsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(habitDaily.amount);

  const habit = habitDaily.habit;
  const date = habitDaily.date;

  let goalPercentage = currentAmount === 0 ? 0 : (currentAmount / habit.goalAmount) * 100;
  if (goalPercentage > 100) {
    goalPercentage = 100;
  }

  const backgroundColor = habit.color ?? '#aaaaaa';
  const lighterBackgroundColor = getLighterBackgroundColor(backgroundColor, 0.15);
  const textColor = getTextColor(backgroundColor);
  const intervalProgressBackgroundColor = getDarkerBackgroundColor(backgroundColor, 0.2);

  const debouncedUpdateHabitDaily = useDebouncedCallback(async (newAmount) => {
    setIsSaving(true);

    try {
      await updateHabitDaily(habit.id, date, newAmount);
    } catch (error) {
      // Revert the amount if the update fails
      setCurrentAmount(habitDaily.amount);
    } finally {
      setIsSaving(false);
    }
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
      className="relative flex w-full flex-col flex-wrap rounded-lg border p-4"
      style={{
        color: textColor,
        borderColor: backgroundColor ?? undefined,
        backgroundColor: lighterBackgroundColor,
      }}
    >
      <div
        className="bg-secondary absolute left-0 top-0 h-full rounded-md transition-all"
        style={{
          width: `${goalPercentage}%`,
          backgroundColor: backgroundColor ?? undefined,
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-[4px] rounded-md bg-red-400 transition-all"
        style={{
          width: `${habitDaily.intervalProgressPercentage}%`,
          backgroundColor: intervalProgressBackgroundColor,
        }}
        title="Progress in the current interval"
      />
      <div className="z-10 flex w-full flex-wrap items-center justify-between gap-2 md:flex-nowrap">
        <div className="flex flex-col">
          <h5 className="flex items-center gap-2 text-xl font-bold">
            <span>{habit.name}</span>
            {typeof habitDaily.streak === 'number' && habitDaily.streak > 0 && (
              <span className="text-xs">🔥 {habitDaily.streak}</span>
            )}
          </h5>
          {habit.description && (
            <div
              className="text-sm"
              style={{
                color: textColor,
              }}
            >
              {habit.description}
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            onClick={onDecrementButtonClick}
            variant="secondary"
            size="sm"
            disabled={isSaving}
          >
            <MinusIcon size={24} />
          </Button>
          <div>
            <div className="flex select-none items-center gap-1">
              <span className="text-2xl font-bold">{currentAmount}</span>
              <HabitDailyEntryEditPopover habitDaily={habitDaily} />
              <span>/</span>
              <span>{habit.goalAmount}</span>
              <span>{habit.goalUnit}</span>
            </div>
            <div className="text-center text-xs">per {habit.goalFrequency}</div>
          </div>
          <Button
            onClick={onIncrementButtonClick}
            variant="secondary"
            size="sm"
            disabled={isSaving}
          >
            <PlusIcon size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

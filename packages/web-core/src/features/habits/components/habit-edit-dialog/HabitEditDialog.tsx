import { useEffect, useState } from 'react';

import {
  CreateHabit,
  HABIT_GOAL_UNITS_DEFAULT,
  HabitGoalFrequencyEnum,
  UpdateHabit,
} from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  sonnerToast,
  Textarea,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import { useHabitsStore } from '../../state/habitsStore';

const DEFAULT_HABIT_DATA = {
  name: '',
  goalAmount: 1,
  goalUnit: HABIT_GOAL_UNITS_DEFAULT[0],
  goalFrequency: HabitGoalFrequencyEnum.DAY,
};

export default function HabitEditDialog() {
  const {
    selectedHabitDialogOpen,
    setSelectedHabitDialogOpen,
    selectedHabitDialog,
    addHabit,
    editHabit,
  } = useHabitsStore();
  const [data, setData] = useState<CreateHabit>(DEFAULT_HABIT_DATA);

  useEffect(() => {
    if (!selectedHabitDialog) {
      return;
    }

    setData({
      name: selectedHabitDialog.name,
      description: selectedHabitDialog.description,
      color: selectedHabitDialog.color,
      goalAmount: selectedHabitDialog.goalAmount,
      goalUnit: selectedHabitDialog.goalUnit,
      goalFrequency: selectedHabitDialog.goalFrequency,
    });
  }, [selectedHabitDialog]);

  const onSaveButtonClick = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const savedHabit = selectedHabitDialog
        ? await editHabit(selectedHabitDialog.id, data as UpdateHabit)
        : await addHabit(data as CreateHabit);

      sonnerToast.success(`Habit saved`, {
        description: `You have successfully saved the habit "${savedHabit.name}".`,
      });

      setSelectedHabitDialogOpen(false);
      setData(DEFAULT_HABIT_DATA);
    } catch (error) {
      sonnerToast.error('Oops!', {
        description:
          error instanceof Error ? error.message : 'Something went wrong while saving the habit.',
      });
    }
  };

  return (
    <Dialog open={selectedHabitDialogOpen} onOpenChange={setSelectedHabitDialogOpen}>
      <DialogContent data-test="habbits--habit-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {selectedHabitDialog?.id && <>Edit "{selectedHabitDialog.name}" Habit</>}
            {!selectedHabitDialog?.id && <>Create Habit</>}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div className="flex flex-col gap-4 p-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                value={data?.name ?? ''}
                onChange={(event) => {
                  setData((current) => ({ ...current, name: event.target.value }));
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-description">Description</Label>
              <Textarea
                id="habit-description"
                rows={5}
                value={data?.description ?? ''}
                onChange={(event) => {
                  setData((current) => ({ ...current, description: event.target.value }));
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-color">Color</Label>
              <ColorSelector
                value={data?.color ?? undefined}
                onChangeValue={(value) => setData((current) => ({ ...current, color: value }))}
                triggerProps={{
                  id: 'habit-color',
                  'data-test': 'habits--habit-edit-dialog--color-select--trigger-button',
                }}
                contentProps={{
                  'data-test': 'habits--habit-edit-dialog--color-select',
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-goal">Goal</Label>
              <div className="flex w-full items-center gap-2">
                <Input
                  type="number"
                  value={data.goalAmount}
                  onChange={(event) => {
                    setData((current) => ({
                      ...current,
                      goalAmount: parseInt(event.target.value),
                    }));
                  }}
                  className="w-20"
                  min={1}
                  max={1000000}
                />
                <select
                  id="habit-goal-unit"
                  className="px-4 py-2"
                  value={data.goalUnit}
                  onChange={(event) => {
                    setData((current) => ({ ...current, goalUnit: event.target.value }));
                  }}
                >
                  {HABIT_GOAL_UNITS_DEFAULT.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <div>per</div>
                <select
                  id="habit-goal-frequency"
                  className="px-4 py-2"
                  value={data.goalFrequency}
                  onChange={(event) => {
                    setData((current) => ({
                      ...current,
                      goalFrequency: event.target.value as HabitGoalFrequencyEnum,
                    }));
                  }}
                >
                  {Object.values(HabitGoalFrequencyEnum).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  DialogContent,
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
  description: '',
  color: '',
  goalAmount: 1,
  goalUnit: HABIT_GOAL_UNITS_DEFAULT[0],
  goalFrequency: HabitGoalFrequencyEnum.DAY,
};

export default function HabitEditDialog() {
  const {
    selectedHabitDialog,
    selectedHabitDialogOpen,
    setSelectedHabitDialogOpen,
    setHabitTemplatesDialogOpen,
    addHabit,
    editHabit,
    deleteHabit,
  } = useHabitsStore();
  const [data, setData] = useState<CreateHabit>(DEFAULT_HABIT_DATA);

  const habitExists = !!selectedHabitDialog?.id;

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
      const savedHabit = selectedHabitDialog?.id
        ? await editHabit(selectedHabitDialog.id, data as UpdateHabit)
        : await addHabit(data as CreateHabit);

      sonnerToast.success(`Habit saved`, {
        description: `You have successfully saved the habit "${savedHabit.name}".`,
      });

      setSelectedHabitDialogOpen(false);
      setData(DEFAULT_HABIT_DATA);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedHabitDialogOpen(false);
    setData(DEFAULT_HABIT_DATA);
  };

  const onDeleteButtonClick = async () => {
    if (!selectedHabitDialog) {
      sonnerToast.error('Oops!', {
        description: 'No habit selected',
      });

      return;
    }

    const result = confirm(
      `Are you sure you want to delete the habit "${selectedHabitDialog!.name}"?`
    );
    if (!result) {
      return;
    }

    try {
      await deleteHabit(selectedHabitDialog.id);

      sonnerToast.success(`Habit "${selectedHabitDialog.name}" deleted`, {
        description: 'You have successfully deleted the habit',
      });

      setSelectedHabitDialogOpen(false);
      setData(DEFAULT_HABIT_DATA);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onUseTemplateButtonClick = () => {
    setHabitTemplatesDialogOpen(true);
  };

  return (
    <Dialog open={selectedHabitDialogOpen} onOpenChange={setSelectedHabitDialogOpen}>
      <DialogContent data-test="habbits--habit-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {habitExists && <>Edit "{selectedHabitDialog.name}" Habit</>}
            {!habitExists && <>Create Habit</>}
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
              <div className="flex w-full flex-wrap items-center gap-2">
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
                  className="bg-background px-4 py-2"
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
                  className="bg-background px-4 py-2"
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
        <div className="flex flex-row justify-between gap-2">
          <div>
            {habitExists && (
              <Button type="button" variant="destructive" onClick={onDeleteButtonClick}>
                Delete
              </Button>
            )}
            {!habitExists && (
              <Button type="button" variant="outline" onClick={onUseTemplateButtonClick}>
                Use Template
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancelButtonClick}>
              Cancel
            </Button>
            <Button type="submit" variant="default" onClick={onSaveButtonClick}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

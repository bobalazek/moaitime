import { useEffect, useState } from 'react';

import { CreateGoal, UpdateGoal } from '@moaitime/shared-common';
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
import { useGoalsStore } from '../../state/goalsStore';

const DEFAULT_GOAL_DATA = {
  name: '',
  description: '',
};

export default function GoalEditDialog() {
  const {
    selectedGoalDialog,
    selectedGoalDialogOpen,
    setSelectedGoalDialogOpen,
    addGoal,
    editGoal,
    deleteGoal,
  } = useGoalsStore();
  const [data, setData] = useState<CreateGoal>(DEFAULT_GOAL_DATA);

  const goalExists = !!selectedGoalDialog?.id;

  useEffect(() => {
    if (!selectedGoalDialog) {
      return;
    }

    setData({
      name: selectedGoalDialog.name,
      description: selectedGoalDialog.description,
      color: selectedGoalDialog.color,
    });
  }, [selectedGoalDialog]);

  const onSaveButtonClick = async () => {
    try {
      const savedGoal = selectedGoalDialog?.id
        ? await editGoal(selectedGoalDialog.id, data as UpdateGoal)
        : await addGoal(data as CreateGoal);

      sonnerToast.success(`Goal saved`, {
        description: `You have successfully saved the goal "${savedGoal.name}".`,
      });

      setSelectedGoalDialogOpen(false);
      setData(DEFAULT_GOAL_DATA);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedGoalDialogOpen(false);
    setData(DEFAULT_GOAL_DATA);
  };

  const onDeleteButtonClick = async () => {
    if (!selectedGoalDialog) {
      sonnerToast.error('Oops!', {
        description: 'No goal selected',
      });

      return;
    }

    const result = confirm(
      `Are you sure you want to delete the goal "${selectedGoalDialog!.name}"?`
    );
    if (!result) {
      return;
    }

    try {
      await deleteGoal(selectedGoalDialog.id);

      sonnerToast.success(`Goal "${selectedGoalDialog.name}" deleted`, {
        description: 'You have successfully deleted the goal',
      });

      setSelectedGoalDialogOpen(false);
      setData(DEFAULT_GOAL_DATA);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <Dialog open={selectedGoalDialogOpen} onOpenChange={setSelectedGoalDialogOpen}>
      <DialogContent data-test="goals--goal-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {goalExists && <>Edit "{selectedGoalDialog.name}" Goal</>}
            {!goalExists && <>Create Goal</>}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div className="flex flex-col gap-4 p-1">
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-name">Name</Label>
              <Input
                id="goal-name"
                value={data?.name ?? ''}
                onChange={(event) => {
                  setData((current) => ({ ...current, name: event.target.value }));
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="habit-description">Description</Label>
              <Textarea
                id="goal-description"
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
          </div>
        </ScrollArea>
        <div className="flex flex-row justify-between gap-2">
          <div>
            {goalExists && (
              <Button type="button" variant="destructive" onClick={onDeleteButtonClick}>
                Delete
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

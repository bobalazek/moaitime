import { useEffect, useState } from 'react';

import {
  CreateHabit,
  UpdateHabit,
  UpdateHabitSchema,
  zodErrorToString,
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

import { useHabitsStore } from '../../state/habitsStore';

export default function HabitEditDialog() {
  const {
    selectedHabitDialogOpen,
    setSelectedHabitDialogOpen,
    selectedHabitDialog,
    addHabit,
    editHabit,
  } = useHabitsStore();
  const [data, setData] = useState<UpdateHabit>();

  useEffect(() => {
    if (!selectedHabitDialog) {
      return;
    }

    const parsedSelectedHabit = UpdateHabitSchema.safeParse(selectedHabitDialog);
    if (!parsedSelectedHabit.success) {
      sonnerToast.error('Oops!', {
        description: zodErrorToString(parsedSelectedHabit.error),
      });

      return;
    }

    setData(parsedSelectedHabit.data);
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
      setData(undefined);
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

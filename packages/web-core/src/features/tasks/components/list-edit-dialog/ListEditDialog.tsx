import { useEffect, useState } from 'react';

import {
  CreateList,
  UpdateList,
  UpdateListSchema,
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
  useToast,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import { useTasksStore } from '../../state/tasksStore';

export default function ListEditDialog() {
  const { toast } = useToast();
  const {
    selectedListDialogOpen,
    setSelectedListDialogOpen,
    selectedListDialog,
    addList,
    editList,
  } = useTasksStore();
  const [data, setData] = useState<UpdateList>();

  useEffect(() => {
    if (!selectedListDialog) {
      setData(undefined);

      return;
    }

    const parsedSelectedList = UpdateListSchema.safeParse(selectedListDialog);
    if (!parsedSelectedList.success) {
      console.log(parsedSelectedList.error);
      toast({
        title: 'Oops!',
        description: zodErrorToString(parsedSelectedList.error),
      });

      return;
    }

    setData(parsedSelectedList.data);
  }, [selectedListDialog, toast]);

  const onSaveButtonClick = async () => {
    try {
      const editedList = selectedListDialog
        ? await editList(selectedListDialog.id, data as UpdateList)
        : await addList(data as CreateList);

      toast({
        title: `List "${editedList.name}" saved`,
        description: `You have successfully saved the list.`,
      });

      setSelectedListDialogOpen(false);
      setData(undefined);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description:
          error instanceof Error ? error.message : 'Something went wrong while saving the list.',
      });
    }
  };

  return (
    <Dialog open={selectedListDialogOpen} onOpenChange={setSelectedListDialogOpen}>
      <DialogContent data-test="tasks--list-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {selectedListDialog ? `Edit "${selectedListDialog.name}" List` : 'New List'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="list-name">Name</Label>
            <Input
              id="list-name"
              type="text"
              value={data?.name ?? ''}
              placeholder="Name"
              onChange={(event) => setData((current) => ({ ...current, name: event.target.value }))}
              autoFocus
              data-test="tasks--list-edit-dialog--name-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="list-color">Color</Label>
            <ColorSelector
              value={data?.color ?? undefined}
              onChangeValue={(value) => setData((current) => ({ ...current, color: value }))}
              triggerProps={{
                id: 'list-color',
                'data-test': 'tasks--list-edit-dialog--color-select--trigger-button',
              }}
              contentProps={{
                'data-test': 'tasks--list-edit-dialog--color-select',
              }}
            />
          </div>
        </div>
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

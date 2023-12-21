import { useEffect, useState } from 'react';

import {
  CreateList,
  TASK_LIST_COLORS,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';

const __EMPTY_VALUE_PLACEHOLDER = '__empty';

export default function ListDialog() {
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
      <DialogContent data-test="tasks--list-dialog">
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
              data-test="tasks--list-dialog--name-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="list-color">Color</Label>
            <Select
              value={data?.color ?? __EMPTY_VALUE_PLACEHOLDER}
              onValueChange={(value) =>
                setData((current) => ({
                  ...current,
                  color: value !== __EMPTY_VALUE_PLACEHOLDER ? value : '',
                }))
              }
            >
              <SelectTrigger
                id="list-color"
                className="w-full"
                data-test="tasks--list-dialog--color-select--trigger-button"
              >
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent data-test="tasks--list-dialog--color-select">
                <SelectItem value={__EMPTY_VALUE_PLACEHOLDER}>
                  <i>None</i>
                </SelectItem>
                {TASK_LIST_COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <span className="inline-block">{color.name}</span>
                    <span
                      className="ml-2 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: color.value }}
                    ></span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

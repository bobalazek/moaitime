import { useEffect, useState } from 'react';

import { TASK_LIST_COLORS } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../state/tasksStore';

const __EMPTY_VALUE_PLACEHOLDER = '__empty';

export default function ListFormDialog() {
  const { toast } = useToast();
  const { listFormDialogOpen, setListFormDialogOpen, selectedListFormDialog, saveListFormDialog } =
    useTasksStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const onSaveButtonClick = async () => {
    try {
      const savedList = await saveListFormDialog({
        name,
        color,
      });

      toast({
        title: `List "${savedList.name}" saved`,
        description: `You have successfully saved the list.`,
      });

      setName('');
      setColor('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description:
          error instanceof Error ? error.message : 'Something went wrong while saving the list.',
      });
    }
  };

  useEffect(() => {
    setName(selectedListFormDialog?.name || '');
    setColor(selectedListFormDialog?.color || '');
  }, [selectedListFormDialog]);

  return (
    <Dialog open={listFormDialogOpen} onOpenChange={setListFormDialogOpen}>
      <DialogContent data-test="tasks--list-form-dialog">
        <DialogHeader>
          <DialogTitle>
            {selectedListFormDialog ? `Edit "${selectedListFormDialog.name}" List` : 'New List'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(event) => setName(event.target.value)}
            autoFocus
            data-test="tasks--list-form-dialog--name-input"
          />
          <Select
            value={color}
            onValueChange={(value) => {
              setColor(value !== __EMPTY_VALUE_PLACEHOLDER ? value : '');
            }}
          >
            <SelectTrigger
              className="w-full"
              data-test="tasks--list-form-dialog--color-select--trigger-button"
            >
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent data-test="tasks--list-form-dialog--color-select">
              <SelectItem value={__EMPTY_VALUE_PLACEHOLDER}>Transparent</SelectItem>
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

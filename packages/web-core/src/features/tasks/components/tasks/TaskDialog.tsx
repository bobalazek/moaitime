import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  Input,
  Label,
  Textarea,
  useToast,
} from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import { ListsSelect } from '../lists/ListsSelect';

export default function TaskDialog() {
  const { toast } = useToast();
  const {
    selectedTaskDialogOpen,
    selectedTask,
    setSelectedTaskDialogOpen,
    editTask,
    deleteTask,
    undeleteTask,
  } = useTasksStore();
  const [data, setData] = useState({
    name: selectedTask?.name ?? '',
    description: selectedTask?.description ?? '',
    listId: selectedTask?.listId,
  });

  useEffect(() => {
    if (!selectedTask) {
      return;
    }

    setData({
      name: selectedTask?.name ?? '',
      description: selectedTask?.description ?? '',
      listId: selectedTask?.listId,
    });
  }, [selectedTask]);

  if (!selectedTaskDialogOpen || !data) {
    return null;
  }

  const onUndeleteButtonClick = async () => {
    if (!selectedTask) {
      return;
    }

    const undeletedTask = await undeleteTask(selectedTask.id);

    toast({
      title: `Task "${data.name}" undeleted`,
      description: 'You have successfully undeleted the task',
    });

    setSelectedTaskDialogOpen(true, undeletedTask);
  };

  const onDeleteButtonClick = async () => {
    if (!selectedTask) {
      return;
    }

    await deleteTask(selectedTask.id);

    toast({
      title: `Task "${data.name}" deleted`,
      description: 'You have successfully deleted the task',
    });

    setSelectedTaskDialogOpen(false, null);
  };

  const onCancelButtonClick = () => {
    setSelectedTaskDialogOpen(false);
  };

  const onSaveButtonClick = async () => {
    if (!selectedTask) {
      return;
    }

    const editedTask = await editTask(selectedTask.id, data);

    toast({
      title: `Task "${editedTask.name}" save`,
      description: 'You have successfully saved the task',
    });

    setSelectedTaskDialogOpen(false);
  };

  return (
    <Dialog open={selectedTaskDialogOpen} onOpenChange={setSelectedTaskDialogOpen}>
      <DialogContent data-test="tasks--task-dialog">
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="task-name">Name</Label>
          <Input
            id="task-name"
            value={data.name}
            onChange={(event) => {
              setData({ ...data, name: event.target.value });
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="task-description">Description</Label>
          <Textarea
            id="task-description"
            rows={5}
            value={data.description}
            onChange={(event) => {
              setData({ ...data, description: event.target.value });
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="task-list">List</Label>
          <ListsSelect
            value={data.listId}
            onChangeValue={(value) => {
              setData({ ...data, listId: value });
            }}
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div>
            {selectedTask?.deletedAt && (
              <Button type="button" variant="destructive" onClick={onUndeleteButtonClick}>
                Undelete
              </Button>
            )}
            {!selectedTask?.deletedAt && (
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

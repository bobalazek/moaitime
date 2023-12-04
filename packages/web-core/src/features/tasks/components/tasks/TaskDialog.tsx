import { useEffect, useState } from 'react';

import { Button, Dialog, DialogContent, Input, Label, Textarea, useToast } from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import { ListsSelect } from '../lists/ListsSelect';

export default function TaskDialog() {
  const { toast } = useToast();
  const { selectedTaskDialogOpen, selectedTask, setSelectedTaskDialogOpen, editTask, deleteTask, undeleteTask } =
    useTasksStore();
  const [task, setTask] = useState(selectedTask);

  useEffect(() => {
    setTask(selectedTask);
  }, [selectedTask]);

  if (!selectedTaskDialogOpen || !task) {
    return null;
  }

  const onUndeleteButtonClick = async () => {
    const undeletedTask = await undeleteTask(task);

    toast({
      title: `Task "${task.name}" undeleted`,
      description: 'You have successfully undeleted the task',
    });

    setSelectedTaskDialogOpen(true, undeletedTask);
  };

  const onDeleteButtonClick = async () => {
    await deleteTask(task);

    toast({
      title: `Task "${task.name}" deleted`,
      description: 'You have successfully deleted the task',
    });

    setSelectedTaskDialogOpen(false, null);
  };

  const onCancelButtonClick = () => {
    setSelectedTaskDialogOpen(false);
  };

  const onSaveButtonClick = async () => {
    const editedTask = await editTask(task);

    toast({
      title: `Task "${editedTask.name}" save`,
      description: 'You have successfully saved the task',
    });

    setSelectedTaskDialogOpen(false);
  };

  return (
    <Dialog open={selectedTaskDialogOpen} onOpenChange={setSelectedTaskDialogOpen} data-test="tasks--task-dialog">
      <DialogContent>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="task-name">Name</Label>
          <Input
            id="task-name"
            value={task.name}
            onChange={(event) => {
              setTask({ ...task, name: event.target.value });
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="task-description">Description</Label>
          <Textarea
            id="task-description"
            rows={5}
            value={task.description}
            onChange={(event) => {
              setTask({ ...task, description: event.target.value });
            }}
          />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="task-list">List</Label>
          <ListsSelect
            value={task.listId}
            onChangeValue={(value) => {
              setTask({ ...task, listId: value });
            }}
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div>
            {task.deletedAt && (
              <Button type="button" variant="destructive" onClick={onUndeleteButtonClick}>
                Undelete
              </Button>
            )}
            {!task.deletedAt && (
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

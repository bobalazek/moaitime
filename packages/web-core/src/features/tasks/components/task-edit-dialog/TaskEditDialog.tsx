import { PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  CreateTask,
  UpdateTask,
  UpdateTaskSchema,
  zodErrorToString,
} from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Input,
  Label,
  sonnerToast,
  Textarea,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import DateSelector from '../../../core/components/selectors/DateSelector';
import { DurationSelector } from '../../../core/components/selectors/DurationSelector';
import { ListSelector } from '../../../core/components/selectors/ListSelector';
import { PrioritySelector } from '../../../core/components/selectors/PrioritySelector';
import { TagSelector } from '../../../core/components/selectors/TagSelector';
import { TaskParentSelector } from '../../../core/components/selectors/TaskParentSelector';
import { useTagsStore } from '../../state/tagsStore';
import { useTasksStore } from '../../state/tasksStore';

export default function TaskEditDialog() {
  const {
    selectedTaskDialogOpen,
    selectedTask,
    setSelectedTaskDialogOpen,
    addTask,
    editTask,
    deleteTask,
    undeleteTask,
  } = useTasksStore();
  const { setTagsDialogOpen } = useTagsStore();
  const [data, setData] = useState<UpdateTask>();

  useEffect(() => {
    if (!selectedTask) {
      setData(undefined);

      return;
    }

    const parsedSelectedTask = UpdateTaskSchema.safeParse(selectedTask);
    if (!parsedSelectedTask.success) {
      sonnerToast.error('Oops!', {
        description: zodErrorToString(parsedSelectedTask.error),
      });

      return;
    }

    setData(parsedSelectedTask.data);
  }, [selectedTask]);

  if (!selectedTaskDialogOpen || !data) {
    return null;
  }

  const onUndeleteButtonClick = async () => {
    if (!selectedTask) {
      return;
    }

    const undeletedTask = await undeleteTask(selectedTask.id);

    sonnerToast.error(`Task "${data.name}" undeleted`, {
      description: 'You have successfully undeleted the task',
    });

    setSelectedTaskDialogOpen(true, undeletedTask);
  };

  const onDeleteButtonClick = async () => {
    if (!selectedTask) {
      return;
    }

    await deleteTask(selectedTask.id);

    sonnerToast.success(`Task "${selectedTask.name}" deleted`, {
      description: 'You have successfully deleted the task',
    });

    setSelectedTaskDialogOpen(false, null);
  };

  const onCancelButtonClick = () => {
    setSelectedTaskDialogOpen(false);
  };

  const onSaveButtonClick = async () => {
    if (!data) {
      return;
    }

    try {
      const editedTask = selectedTask?.id
        ? await editTask(selectedTask.id, data)
        : await addTask(data as CreateTask);

      sonnerToast.success(`Task "${editedTask.name}" save`, {
        description: 'You have successfully saved the task',
      });

      setSelectedTaskDialogOpen(false);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog open={selectedTaskDialogOpen} onOpenChange={setSelectedTaskDialogOpen}>
      <DialogContent data-test="tasks--task-edit-dialog">
        <DialogHeader>
          {selectedTask?.id && <>Edit "{selectedTask.name}" Task</>}
          {!selectedTask?.id && <>Create Task</>}
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-name">Name</Label>
          <Input
            id="task-name"
            value={data.name ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, name: event.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-description">Description</Label>
          <Textarea
            id="task-description"
            rows={5}
            value={data.description ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, description: event.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-list">List</Label>
          <ListSelector
            value={data.listId ?? undefined}
            onChangeValue={(value) => {
              setData((current) => ({ ...current, listId: value ?? null }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-color">Color</Label>
          <ColorSelector
            value={data?.color ?? undefined}
            onChangeValue={(value) => setData((current) => ({ ...current, color: value ?? null }))}
            placeholderText="Inherit from list"
            triggerProps={{
              id: 'task-color',
              'data-test': 'tasks--task-edit-dialog--color-select--trigger-button',
            }}
            contentProps={{
              'data-test': 'tasks--task-edit-dialog--color-select',
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-priority">Priority</Label>
          <PrioritySelector
            value={data?.priority?.toString() ?? undefined}
            onChangeValue={(value) =>
              setData((current) => ({ ...current, priority: value ? parseInt(value) : null }))
            }
            triggerProps={{
              id: 'task-priority',
              'data-test': 'tasks--task-edit-dialog--priority-select--trigger-button',
            }}
            contentProps={{
              'data-test': 'tasks--task-edit-dialog--priority-select',
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-list">Duration</Label>
          <DurationSelector
            value={data?.durationSeconds ?? undefined}
            onChangeValue={(value) =>
              setData((current) => ({ ...current, durationSeconds: value ?? null }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-list">Due Date</Label>
          <DateSelector
            includeTime
            disablePast
            data={{
              date: data.dueDate ?? null,
              dateTime: data.dueDateTime ?? null,
              dateTimeZone: data.dueDateTimeZone ?? null,
            }}
            onSaveData={(saveData) => {
              setData({
                ...data,
                dueDate: saveData.date,
                dueDateTime: saveData.dateTime,
                dueDateTimeZone: saveData.dateTimeZone,
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-parent" className="flex items-center gap-2">
            <span>Tags</span>
            <button
              type="button"
              onClick={() => {
                setTagsDialogOpen(true);
              }}
            >
              <PencilIcon size={12} />
            </button>
          </Label>
          <TagSelector
            values={data?.tagIds ?? []}
            onChangeValue={(values) => setData((current) => ({ ...current, tagIds: values }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="task-parent">Parent</Label>
          <TaskParentSelector
            value={data?.parentId ?? undefined}
            onChangeValue={(value) =>
              setData((current) => ({ ...current, parentId: value ?? null }))
            }
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

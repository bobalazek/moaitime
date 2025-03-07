import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import {
  CreateTask,
  getStartAndEndDatesForTask,
  Task,
  UpdateTask,
  UpdateTaskSchema,
  zodErrorToString,
} from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  sonnerToast,
  Textarea,
} from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import DueDateSelector from '../../../core/components/selectors/DueDateSelector';
import { DurationSelector } from '../../../core/components/selectors/DurationSelector';
import { ListSelector } from '../../../core/components/selectors/ListSelector';
import { PrioritySelector } from '../../../core/components/selectors/PrioritySelector';
import { TagsSelector } from '../../../core/components/selectors/TagsSelector';
import { TaskParentSelector } from '../../../core/components/selectors/TaskParentSelector';
import { TeamMembersSelector } from '../../../core/components/selectors/TeamMembersSelector';
import { useListsStore } from '../../state/listsStore';
import { useTagsStore } from '../../state/tagsStore';
import { useTasksStore } from '../../state/tasksStore';

function DueDateRangesHelperText({ task }: { task: Task }) {
  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');
  const tasksDefaultDurationSeconds = useAuthUserSetting('tasksDefaultDurationSeconds', 60 * 30);

  if (!task.dueDate) {
    return null;
  }

  const timesObject = getStartAndEndDatesForTask(
    task,
    generalTimezone,
    tasksDefaultDurationSeconds
  );
  if (!timesObject) {
    return null;
  }

  const endsText =
    format(new Date(timesObject.endsAtUtc), 'PPP p') +
    (task.dueDateTimeZone ? ` (${timesObject.endTimezone})` : '');
  const startsText =
    format(new Date(timesObject.startsAtUtc), 'PPP p') +
    (task.dueDateTimeZone ? ` (${timesObject.timezone})` : '');

  return (
    <div className="text-muted-foreground text-sm">
      <div>
        Due on <b>{endsText}</b>, from <b>{startsText}</b>
      </div>
      <div className="mt-1 text-[0.65rem] leading-4">
        The <i>from</i> date is derived by subtracting the duration from the due date.
        {!task.durationSeconds && (
          <>
            {' '}
            It assumes {tasksDefaultDurationSeconds / 60} minutes by default, if no duration is set.
          </>
        )}
      </div>
    </div>
  );
}

export default function TaskEditDialog() {
  const {
    selectedTaskDialogOpen,
    selectedTask,
    setUsersNudgeDialogOpen,
    setSelectedTaskDialogOpen,
    addTask,
    editTask,
    deleteTask,
    undeleteTask,
  } = useTasksStore();
  const { lists, selectedList } = useListsStore();
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

  const teamId = data?.listId ? lists.find((list) => list.id === data.listId)?.teamId : null;

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
      // Already handled by the fetch function
    }
  };

  return (
    <Dialog open={selectedTaskDialogOpen} onOpenChange={setSelectedTaskDialogOpen}>
      <DialogContent
        data-test="tasks--task-edit-dialog"
        className="flex max-h-[90vh] flex-col overflow-hidden"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="truncate">
            {selectedTask?.id && <>Edit "{selectedTask.name}" Task</>}
            {!selectedTask?.id && <>Create Task</>}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col gap-4">
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
                onChangeValue={(value) =>
                  setData((current) => ({ ...current, color: value ?? null }))
                }
                placeholderText="None"
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
              <Label htmlFor="task-duration">Duration</Label>
              <DurationSelector
                value={data?.durationSeconds ?? undefined}
                onChangeValue={(value) =>
                  setData((current) => ({ ...current, durationSeconds: value ?? null }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <DueDateSelector
                includeTime
                includeRepeat
                disablePast
                data={{
                  date: data.dueDate ?? null,
                  dateTime: data.dueDateTime ?? null,
                  dateTimeZone: data.dueDateTimeZone ?? null,
                  repeatPattern: data.dueDateRepeatPattern ?? null,
                  repeatEndsAt: data.dueDateRepeatEndsAt ?? null,
                }}
                onSaveData={(saveData) => {
                  setData({
                    ...data,
                    dueDate: saveData.date,
                    dueDateTime: saveData.dateTime,
                    dueDateTimeZone: saveData.dateTimeZone,
                    dueDateRepeatPattern: saveData.repeatPattern,
                    dueDateRepeatEndsAt: saveData.repeatEndsAt,
                  });
                }}
              />
              <DueDateRangesHelperText task={{ ...selectedTask, ...data } as unknown as Task} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-tags" className="flex items-end justify-between gap-2">
                <span>Tags</span>
                <button
                  type="button"
                  className="bg-primary-foreground rounded-md px-2 py-0.5 text-xs"
                  onClick={() => {
                    setTagsDialogOpen(true);
                  }}
                >
                  Edit Tags
                </button>
              </Label>
              <TagsSelector
                value={data?.tagIds ?? []}
                onChangeValue={(value) => setData((current) => ({ ...current, tagIds: value }))}
                teamId={teamId}
              />
              {teamId && (
                <div className="text-muted-foreground text-xs">
                  Only tags for this team will be shown
                </div>
              )}
            </div>
            {selectedList?.teamId && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="task-assignees" className="flex items-end justify-between gap-2">
                  <div>Assignees</div>
                  {data?.userIds && data?.userIds.length > 0 && (
                    <button
                      type="button"
                      className="bg-primary-foreground rounded-md px-2 py-0.5 text-xs"
                      onClick={() => {
                        setUsersNudgeDialogOpen(true);
                      }}
                    >
                      Nudge
                    </button>
                  )}
                </Label>
                <TeamMembersSelector
                  value={data?.userIds ?? []}
                  onChangeValue={(value) => setData((current) => ({ ...current, userIds: value }))}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-parent">Parent</Label>
              <TaskParentSelector
                value={data?.parentId ?? undefined}
                onChangeValue={(value) =>
                  setData((current) => ({ ...current, parentId: value ?? null }))
                }
                currentTask={selectedTask}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-shrink-0 flex-row justify-between gap-2">
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

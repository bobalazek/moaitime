import { clsx } from 'clsx';
import { memo, useCallback, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { Task as TaskType } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useSingleAndDoubleClick } from '../../../core/hooks/useSingleAndDoubleClick';
import { getTextColor } from '../../../core/utils/ColorHelpers';
import { useTasksStore } from '../../state/tasksStore';
import { setCursorToEnd } from '../../utils/TaskHelpers';
import TaskItemActions from './TaskItemActions';
import TaskItemDeletedAt from './TaskItemDeletedAt';
import TaskItemDueDate from './TaskItemDueDate';
import TaskItemDuration from './TaskItemDuration';
import TaskItemPriority from './TaskItemPriority';
import TaskItemTags from './TaskItemTags';
import TaskItemUsers from './TaskItemUsers';

export type TaskItemProps = {
  task: TaskType;
  setCanDrag?: (canDrag: boolean) => void;
  depth?: number;
};

const TaskItem = memo(({ task, setCanDrag, depth = 0 }: TaskItemProps) => {
  const { highlightedTaskId, setSelectedTaskDialogOpen, editTask, completeTask, uncompleteTask } =
    useTasksStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const textElementRef = useRef<HTMLDivElement | null>(null);

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');
  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const isCompleted = !!task.completedAt;
  const isDeleted = !!task.deletedAt;
  const taskTags = task.tags ?? [];
  const taskUsers = task.users ?? [];

  const backgroundColor = task.color ?? '';
  const color = getTextColor(backgroundColor);

  const onClick = useCallback(() => {
    // Prevent opening the dialog when the task is being edited
    if (textElementRef.current?.contentEditable === 'true') {
      return;
    }

    setSelectedTaskDialogOpen(true, task);
  }, [setSelectedTaskDialogOpen, task]);

  const onDoubleClick = useCallback(
    (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, cursorAtEnd?: boolean) => {
      event?.stopPropagation();

      if (!textElementRef.current) {
        return;
      }

      textElementRef.current.contentEditable = 'true';
      setCanDrag?.(false);

      setTimeout(() => {
        if (!textElementRef.current) {
          return;
        }

        textElementRef.current.focus();

        if (cursorAtEnd) {
          setCursorToEnd(textElementRef.current);
        }
      }, 0);
    },
    [setCanDrag]
  );

  const onKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();

      document.execCommand('insertText', false, ' ');
    } else if (event.key === 'Enter') {
      event.preventDefault();

      (event.target as HTMLElement).blur();
    }
  };

  const onBlur = async (e: React.FocusEvent<HTMLDivElement>) => {
    const name = e.target.innerText.trim();
    if (name === task.name) {
      e.target.contentEditable = 'false';
      setCanDrag?.(true);

      return;
    }

    if (name) {
      await editTask(task.id, { name });
    } else {
      e.target.innerText = task.name;
    }

    e.target.contentEditable = 'false';
    setCanDrag?.(true);
  };

  const onCompleteCheckboxToggle = async (value: boolean) => {
    if (!value) {
      await uncompleteTask(task.id);
    } else {
      await completeTask(task.id);

      setShowConfetti(true);
    }
  };

  const onSingleAndDoubleClick = useSingleAndDoubleClick(onClick, onDoubleClick);

  return (
    <div
      id={`task-${task.id}`}
      data-test="tasks--task--wrapper"
      style={{
        marginLeft: depth * 16,
      }}
    >
      <div
        className={clsx(
          'flex flex-col rounded-lg p-1 outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
          highlightedTaskId === task.id && 'bg-yellow-100 dark:bg-yellow-900'
        )}
        onClick={onSingleAndDoubleClick}
        data-test="tasks--task"
        data-task-id={task.id}
        data-task-color={task.color}
      >
        <div className="relative w-full">
          {showConfetti && (
            <ConfettiExplosion
              zIndex={9999}
              particleSize={6}
              particleCount={50}
              duration={2200}
              onComplete={() => {
                setShowConfetti(false);
              }}
            />
          )}
          <Checkbox
            className="absolute left-0 top-1"
            checked={!!task.completedAt}
            onCheckedChange={onCompleteCheckboxToggle}
            onClick={(event) => event.stopPropagation()}
            style={{
              backgroundColor,
              color,
            }}
            data-test="tasks--task--completed-checkbox"
          />
          <div
            ref={textElementRef}
            className={clsx(
              'break-words px-6',
              (isCompleted || isDeleted) && 'text-gray-400 ',
              isCompleted && 'line-through'
            )}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            data-test="tasks--task--name"
          >
            {task.name}
          </div>
          <TaskItemActions
            task={task}
            onEditAndFocus={() => onDoubleClick(undefined, true)}
            onAddSubTaskButtonClick={
              depth === 0
                ? () =>
                    setSelectedTaskDialogOpen(true, {
                      parentId: task.id,
                      listId: task.listId,
                    } as TaskType)
                : undefined
            }
          />
        </div>
        {(task.priority ||
          task.dueDate ||
          task.durationSeconds ||
          task.deletedAt ||
          taskTags.length > 0 ||
          taskUsers.length > 0) && (
          <div className="ml-6 mt-1.5 flex flex-col gap-1">
            <TaskItemPriority task={task} />
            <TaskItemUsers task={task} />
            <TaskItemTags task={task} />
            <TaskItemDuration task={task} />
            <TaskItemDueDate
              task={task}
              timezone={generalTimezone}
              startDayOfWeek={generalStartDayOfWeek}
            />
            <TaskItemDeletedAt task={task} />
          </div>
        )}
      </div>
      {task.children?.map((child) => <TaskItem key={child.id} task={child} depth={depth + 1} />)}
    </div>
  );
});

export default TaskItem;

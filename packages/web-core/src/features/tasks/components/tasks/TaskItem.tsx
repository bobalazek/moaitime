import { clsx } from 'clsx';
import { colord } from 'colord';
import { memo, useCallback, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { Task as TaskType } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSingleAndDoubleClick } from '../../../core/hooks/useSingleAndDoubleClick';
import { useTasksStore } from '../../state/tasksStore';
import { setCursorToEnd } from '../../utils/TaskHelpers';
import TaskItemDeletedAt from './task-item/TaskItemDeletedAt';
import TaskItemDueDate from './task-item/TaskItemDueDate';
import TaskItemPriority from './task-item/TaskItemPriority';
import TaskItemActions from './TaskItemActions';

const TaskItem = memo(({ task, depth = 0 }: { task: TaskType; depth: number }) => {
  const { setSelectedTaskDialogOpen, editTask, completeTask, uncompleteTask } = useTasksStore();
  const { auth } = useAuthStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const textElementRef = useRef<HTMLDivElement | null>(null);

  const generalTimezone = auth?.user?.settings?.generalTimezone ?? 'UTC';
  const generalStartDayOfWeek = auth?.user?.settings?.generalStartDayOfWeek ?? 0;
  const isCompleted = !!task.completedAt;
  const isDeleted = !!task.deletedAt;

  const onClick = useCallback(() => {
    setSelectedTaskDialogOpen(true, task);
  }, [setSelectedTaskDialogOpen, task]);

  const onDoubleClick = useCallback(
    (event?: React.MouseEvent<HTMLDivElement, MouseEvent>, cursorAtEnd?: boolean) => {
      event?.stopPropagation();

      if (!textElementRef.current) {
        return;
      }

      textElementRef.current.contentEditable = 'true';

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
    []
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

      return;
    }

    if (name) {
      await editTask(task.id, { name });
    } else {
      e.target.innerText = task.name;
    }

    e.target.contentEditable = 'false';
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

  const checkboxBackgroundColor = task.color ?? '';
  const checkboxColor = checkboxBackgroundColor
    ? colord(checkboxBackgroundColor).isDark()
      ? 'white'
      : 'black'
    : '';

  return (
    <div
      data-test="tasks--task-wrapper"
      style={{
        marginLeft: depth * 16,
      }}
    >
      <div
        className="rounded-lg p-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
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
              backgroundColor: checkboxBackgroundColor,
              color: checkboxColor,
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
          <div className="mt-2 flex flex-col gap-1">
            <TaskItemPriority task={task} />
            <TaskItemDueDate
              task={task}
              timezone={generalTimezone}
              startDayOfWeek={generalStartDayOfWeek}
            />
            <TaskItemDeletedAt task={task} />
            <TaskItemActions task={task} onEditAndFocus={() => onDoubleClick(undefined, true)} />
          </div>
        </div>
      </div>
      {task.children?.map((child) => <TaskItem key={child.id} task={child} depth={depth + 1} />)}
    </div>
  );
});

export default TaskItem;

import { clsx } from 'clsx';
import { colord } from 'colord';
import { formatRelative } from 'date-fns';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { memo, useCallback, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { DayOfWeek, prioritiesColorMap, Task as TaskType } from '@moaitime/shared-common';
import { Checkbox, cn } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useSingleAndDoubleClick } from '../../../core/hooks/useSingleAndDoubleClick';
import { useTasksStore } from '../../state/tasksStore';
import TaskItemActions from './TaskItemActions';

function setCursorToEnd(element: HTMLElement) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection?.removeAllRanges();
  selection?.addRange(range);
}

const TaskItemDueDate = ({
  task,
  timezone,
  startDayOfWeek,
}: {
  task: TaskType;
  timezone: string;
  startDayOfWeek: DayOfWeek;
}) => {
  if (!task.dueDate) {
    return null;
  }

  let dateString = task.dueDate;
  if (task.dueDateTime) {
    dateString = `${dateString}T${task.dueDateTime}:00.000`;
  } else {
    dateString = dateString + 'T23:59:59.999';
  }

  if (task.dueDateTimeZone) {
    const timezonedDate = utcToZonedTime(
      zonedTimeToUtc(dateString, task.dueDateTimeZone),
      timezone
    );

    dateString = timezonedDate.toISOString();
  }

  const now = new Date();
  const date = new Date(dateString);

  const dueInSeconds = (date.getTime() - now.getTime()) / 1000;
  const isDueSoon = dueInSeconds < 60 * 60 * 24 * 3 && dueInSeconds > 60 * 60 * 24;
  const isAlmostDue = dueInSeconds < 60 * 60 * 24 && dueInSeconds > 0;
  const isOverDue = dueInSeconds < 0;

  const dueDateString = format(date, 'PPP p');
  const dueDateRelativeString = formatRelative(date, now, {
    weekStartsOn: startDayOfWeek,
  });

  return (
    <div
      className={cn(
        'ml-6 mt-1 text-xs',
        isDueSoon && 'text-yellow-400',
        isAlmostDue && 'text-orange-400',
        isOverDue && 'font-semibold text-red-400'
      )}
      title={dueDateString}
      data-test="tasks--task--due-text"
    >
      Due {dueDateRelativeString}
    </div>
  );
};

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
          <TaskItemDueDate
            task={task}
            timezone={generalTimezone}
            startDayOfWeek={generalStartDayOfWeek}
          />
          {task.deletedAt && (
            <p className="ml-6 mt-1 text-xs text-gray-400" data-test="tasks--task--deleted-text">
              (deleted at {new Date(task.deletedAt).toLocaleString()})
            </p>
          )}
          {task.priority && (
            <div
              className="ml-6 mt-1 text-xs font-bold"
              data-test="tasks--task--priority-text"
              style={{
                color: prioritiesColorMap.get(task.priority) ?? '',
              }}
            >
              P{task.priority}
            </div>
          )}
          <TaskItemActions task={task} onEditAndFocus={() => onDoubleClick(undefined, true)} />
        </div>
      </div>
      {task.children?.map((child) => <TaskItem key={child.id} task={child} depth={depth + 1} />)}
    </div>
  );
});

export default TaskItem;

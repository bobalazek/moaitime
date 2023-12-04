import { clsx } from 'clsx';
import { memo, useCallback, useRef, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import { TaskInterface } from '@myzenbuddy/shared-common';
import { Checkbox } from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';
import TaskActions from './TaskActions';

function setCursorToEnd(element: HTMLElement) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection?.removeAllRanges();
  selection?.addRange(range);
}

const Task = memo(({ task }: { task: TaskInterface }) => {
  const { editTask } = useTasksStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const textElementRef = useRef<HTMLDivElement | null>(null);

  const onDoubleClick = useCallback((event?: React.MouseEvent<HTMLDivElement, MouseEvent>, cursorAtEnd?: boolean) => {
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
  }, []);

  const onKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();

      document.execCommand('insertText', false, ' ');
    } else if (e.key === 'Enter') {
      e.preventDefault();

      (e.target as HTMLElement).blur();
    }
  };

  const onBlur = async (e: React.FocusEvent<HTMLDivElement>) => {
    const name = e.target.innerText.trim();
    if (name === task.name) {
      e.target.contentEditable = 'false';

      return;
    }

    if (name) {
      await editTask({ ...task, name });
    } else {
      e.target.innerText = task.name;
    }

    e.target.contentEditable = 'false';
  };

  const onCompleteCheckboxToggle = async (value: boolean) => {
    await editTask({
      ...task,
      completedAt: task.completedAt ? undefined : new Date().toISOString(),
    });

    if (!value) {
      return;
    }

    setShowConfetti(true);
  };

  const isCompleted = !!task.completedAt;
  const isDeleted = !!task.deletedAt;

  return (
    <div className="rounded-lg p-1 outline-none hover:bg-gray-700" data-test="tasks--task">
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
          data-test="tasks--task--completed-checkbox"
        />
        <div
          ref={textElementRef}
          className={clsx(
            'break-words px-6',
            (isCompleted || isDeleted) && 'text-gray-400 ',
            isCompleted && 'line-through'
          )}
          onDoubleClick={onDoubleClick}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          data-test="tasks--task--name"
        >
          {task.name}
        </div>
        {task.deletedAt && (
          <p className="mt-1 ml-6 text-xs text-gray-400" data-test="tasks--task--deleted-text">
            (deleted at {new Date(task.deletedAt).toLocaleString()})
          </p>
        )}
        <TaskActions task={task} onEditAndFocus={() => onDoubleClick(undefined, true)} />
      </div>
    </div>
  );
});

export default Task;

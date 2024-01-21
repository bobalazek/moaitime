import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Task } from '@moaitime/shared-common';
import { cn, Input, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useTasksStore } from '../../../tasks/state/tasksStore';

// TODO: need to somehow fix the issue of focusing on the command items once it's open

export type TaskAutocompleteProps = {
  value: string | null;
  taskId?: string;
  onChangeValue: (value: string) => void;
  onSelectTask?: (taskId?: string | null) => void;
  inputWrapperClassName?: string;
  inputClassName?: string;
  inputCloseButtonClassName?: string;
};

export function TaskAutocomplete({
  value,
  taskId,
  onChangeValue,
  onSelectTask,
  inputWrapperClassName,
  inputClassName,
  inputCloseButtonClassName,
}: TaskAutocompleteProps) {
  const { getTasksByQuery } = useTasksStore();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value || '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusedTaskId, setFocusedTaskId] = useState<string | undefined>();

  const inputDisabled = !!taskId;

  const searchTasksDebounced = useDebouncedCallback(async (value: string) => {
    const foundTasks = await getTasksByQuery(value);
    setTasks(foundTasks);

    if (foundTasks.length > 0) {
      setOpen(foundTasks.length > 0);
      setFocusedTaskId(foundTasks[0].id);
    }
  }, 500);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setText(newText);

    onChangeValue(newText);

    if (newText && !taskId) {
      searchTasksDebounced(newText);
    }
  };

  const onSelectTaskButtonClick = useCallback(
    (task: Task) => {
      onSelectTask?.(task.id);
      onChangeValue(task.name);
      setText(task.name);
      setOpen(false);
    },
    [onSelectTask, onChangeValue]
  );

  const onClearButtonClick = () => {
    onSelectTask?.(null);
    setText('');
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Space') {
        const focusedTask = tasks.find((task) => task.id === focusedTaskId);
        if (focusedTask) {
          onSelectTaskButtonClick(focusedTask);
        }
      } else if (event.key === 'ArrowDown') {
        const index = tasks.findIndex((task) => task.id === focusedTaskId);
        if (index < tasks.length - 1) {
          setFocusedTaskId(tasks[index + 1].id);
        }
      } else if (event.key === 'ArrowUp') {
        const index = tasks.findIndex((task) => task.id === focusedTaskId);
        if (index > 0) {
          setFocusedTaskId(tasks[index - 1].id);
        }
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);
  }, [open, focusedTaskId, tasks, setFocusedTaskId, onSelectTaskButtonClick]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn('relative w-full', inputWrapperClassName)}>
        <Input
          autoFocus
          className={cn('w-full', inputClassName)}
          placeholder="Search tasks ..."
          disabled={inputDisabled}
          value={text}
          onChange={onInputChange}
        />
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        {text && (
          <button
            type="button"
            className={cn('absolute bottom-0 right-2 top-0 p-2', inputCloseButtonClassName)}
            onClick={onClearButtonClick}
          >
            <XIcon />
          </button>
        )}
      </div>
      <PopoverContent
        className="p-0"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        data-test="task-autocomplete"
      >
        {tasks.map((task) => (
          <button
            type="button"
            key={task.id}
            onClick={() => onSelectTaskButtonClick(task)}
            className={cn(
              'hover:bg-accent hover:text-accent-foreground w-full px-4 py-2 text-left focus:outline-none',
              {
                'bg-accent text-accent-foreground': task.id === focusedTaskId,
              }
            )}
          >
            {task.name}
            {task.list && ` (${task.list.name})`}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

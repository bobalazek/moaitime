import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Task } from '@moaitime/shared-common';
import {
  cn,
  Command,
  CommandItem,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@moaitime/web-ui';

import { useTasksStore } from '../../../tasks/state/tasksStore';

// TODO: need to somehow fix the issue of focusing on the command items once it's open

export function TaskAutocomplete({
  inputWrapperClassName,
  inputClassName,
  inputCloseButtonClassName,
  value,
  taskId,
  onChangeValue,
  onSelectTask,
}: {
  inputWrapperClassName?: string;
  inputClassName?: string;
  inputCloseButtonClassName?: string;
  value?: string;
  taskId?: string;
  onChangeValue: (value?: string) => void;
  onSelectTask?: (taskId?: string) => void;
}) {
  const { getTasksByQuery } = useTasksStore();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value || '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState(taskId);

  const searchTasksDebounced = useDebouncedCallback(async (value: string) => {
    const foundTasks = await getTasksByQuery(value);
    setTasks(foundTasks);
    setOpen(foundTasks.length > 0);
  }, 500);

  useEffect(() => {
    onChangeValue(text);

    if (text && !selectedTaskId) {
      searchTasksDebounced(text);
    }
  }, [text, selectedTaskId, onChangeValue, searchTasksDebounced]);

  useEffect(() => {
    onSelectTask?.(selectedTaskId);
  }, [selectedTaskId, onSelectTask]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn('relative w-full', inputWrapperClassName)}>
        <Input
          autoFocus
          className={cn('w-full', inputClassName)}
          placeholder="Search tasks ..."
          disabled={!!selectedTaskId}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        {text && (
          <button
            type="button"
            className={cn('absolute bottom-0 right-2 top-0 p-2', inputCloseButtonClassName)}
            onClick={() => {
              setText('');
              setSelectedTaskId(undefined);
            }}
          >
            <XIcon />
          </button>
        )}
      </div>

      <PopoverContent className="p-0" data-test="task-autocomplete">
        <Command shouldFilter={false} value={selectedTaskId} onValueChange={setSelectedTaskId}>
          {tasks.map((task) => (
            <CommandItem
              key={task.id}
              value={task.id}
              onSelect={() => {
                setSelectedTaskId(task.id);
                setText(task.name);
                setOpen(false);
              }}
              className="cursor-pointer border-l-4 border-l-transparent"
            >
              {task.name}
              {task.list && ` (${task.list.name})`}
            </CommandItem>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

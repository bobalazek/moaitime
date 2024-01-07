import { clsx } from 'clsx';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

import { Task } from '@moaitime/shared-common';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@moaitime/web-ui';

import { useListsStore } from '../../../tasks/state/listsStore';
import { useTasksStore } from '../../../tasks/state/tasksStore';

const __EMPTY_VALUE_PLACEHOLDER = '__empty';

export function TaskParentSelector({
  value,
  onChangeValue,
  isReadonly,
}: {
  value?: string;
  onChangeValue: (value?: string, task?: Task) => void;
  isReadonly?: boolean;
}) {
  const { selectedTask } = useTasksStore();
  const { selectedListTasks } = useListsStore();
  const [open, setOpen] = useState(false);

  const hasSelectedTaskChildren = selectedTask?.children?.length ?? 0 > 0;
  if (hasSelectedTaskChildren) {
    return (
      <p className="text-muted-foreground text-xs">
        A task with children cannot have a parent task. Please remove the children first.
      </p>
    );
  }

  const selectedParentTask = selectedListTasks.find((task) => task.id === value) ?? null;

  const tasks = selectedListTasks.filter((task) => {
    if (selectedTask) {
      return task.id !== selectedTask.id;
    }

    return true;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isReadonly}
          data-test="task-parent-selector--trigger-button"
        >
          <div>
            <span className="mr-2 inline-block h-2 w-2 rounded-full" />
            {selectedParentTask ? selectedParentTask.name : 'Select task ...'}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="task-parent-selector">
        <Command>
          <CommandInput placeholder="Search tasks ..." />
          <CommandEmpty>No task found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value={__EMPTY_VALUE_PLACEHOLDER}
              onSelect={() => {
                onChangeValue(undefined);
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              <CheckIcon className={clsx('mr-2 h-4 w-4', !value ? 'opacity-100' : 'opacity-0')} />
              <i>None</i>
            </CommandItem>
            {tasks.map((task) => (
              <CommandItem
                key={task.id}
                value={task.id}
                onSelect={(currentValue) => {
                  onChangeValue(currentValue, task);
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <CheckIcon
                  className={clsx('mr-2 h-4 w-4', value === task.id ? 'opacity-100' : 'opacity-0')}
                />
                {task.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

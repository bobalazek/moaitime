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
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@moaitime/web-ui';

import { useListsStore } from '../../../tasks/state/listsStore';
import { useTasksStore } from '../../../tasks/state/tasksStore';

const EMPTY_VALUE_PLACEHOLDER = '__empty';

export type TaskParentSelectorProps = {
  value?: string;
  onChangeValue: (value?: string, task?: Task) => void;
  isReadonly?: boolean;
  currentTask?: Task | null;
};

export function TaskParentSelector({
  value,
  onChangeValue,
  isReadonly,
  currentTask,
}: TaskParentSelectorProps) {
  const { selectedTask } = useTasksStore();
  const { selectedListTasks } = useListsStore();
  const [open, setOpen] = useState(false);
  const [commandValue, setCommandValue] = useState('');

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
    return task.name.toLowerCase().includes(commandValue.toLowerCase());
  });

  const disabledTaskIds = currentTask?.id ? [currentTask.id] : [];

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      modal={true /* Must have, else scroll won't work! */}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isReadonly}
          data-test="task-parent-selector--trigger-button"
        >
          <div className="truncate">
            {selectedParentTask && <span>{selectedParentTask.name}</span>}
            {!value && <span className="text-muted-foreground">Select task ...</span>}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="task-parent-selector">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tasks ..."
            value={commandValue}
            onValueChange={setCommandValue}
          />
          <CommandEmpty>No task found.</CommandEmpty>
          <CommandList>
            <CommandGroup className="w-full">
              {!commandValue && (
                <CommandItem
                  value={EMPTY_VALUE_PLACEHOLDER}
                  onSelect={() => {
                    onChangeValue(undefined);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <CheckIcon
                    className={clsx('mr-2 h-4 w-4', !value ? 'opacity-100' : 'opacity-0')}
                  />
                  <i>None</i>
                </CommandItem>
              )}
              {tasks.length === 0 && (
                <CommandItem disabled className="text-muted-foreground">
                  No tasks found
                </CommandItem>
              )}
              {tasks.map((task) => (
                <CommandItem
                  key={task.id}
                  value={task.id}
                  onSelect={(currentValue) => {
                    onChangeValue(currentValue, task);
                    setOpen(false);
                  }}
                  disabled={disabledTaskIds.includes(task.id)}
                  className="w-full cursor-pointer"
                >
                  <CheckIcon
                    className={clsx(
                      'mr-2 h-4 w-4',
                      value === task.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="truncate">{task.name}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

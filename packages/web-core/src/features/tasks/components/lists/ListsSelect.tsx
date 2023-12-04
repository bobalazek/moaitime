import { clsx } from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

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
} from '@myzenbuddy/web-ui';

import { useTasksStore } from '../../state/tasksStore';

export function ListsSelect({ value, onChangeValue }: { value?: string; onChangeValue: (value?: string) => void }) {
  const { lists } = useTasksStore();
  const [open, setOpen] = useState(false);

  const selectedList = lists.find((list) => list.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-test="tasks--list-select--trigger-button"
        >
          <div>
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: selectedList?.color ?? 'transparent',
              }}
            />
            {selectedList ? selectedList.name : 'Select list ...'}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="tasks--list-select">
        <Command>
          <CommandInput placeholder="Search lists ..." />
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandGroup>
            {lists.map((list) => (
              <CommandItem
                key={list.id}
                value={list.id}
                onSelect={(currentValue) => {
                  onChangeValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
                className="cursor-pointer border-l-4 border-l-transparent"
                style={{
                  borderColor: list?.color ?? 'transparent',
                }}
              >
                <Check className={clsx('mr-2 h-4 w-4', value === list.id ? 'opacity-100' : 'opacity-0')} />
                {list.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

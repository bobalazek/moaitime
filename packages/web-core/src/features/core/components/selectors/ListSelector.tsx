import { clsx } from 'clsx';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

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

export function ListSelector({
  value,
  onChangeValue,
}: {
  value?: string;
  onChangeValue: (value?: string) => void;
}) {
  const { lists } = useListsStore();
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
          data-test="list-selector--trigger-button"
        >
          <div>
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: selectedList?.color ?? 'transparent',
              }}
            />
            {selectedList ? selectedList.name : 'Unlisted'}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="list-selector">
        <Command>
          <CommandInput placeholder="Search lists ..." />
          <CommandEmpty>No list found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChangeValue(undefined);
                  setOpen(false);
                }}
                className="cursor-pointer border-l-4 border-l-transparent"
              >
                <CheckIcon
                  className={clsx(
                    'mr-2 h-4 w-4',
                    value === undefined ? 'opacity-100' : 'opacity-0'
                  )}
                />
                Unlisted
              </CommandItem>
              {lists.map((list) => (
                <CommandItem
                  key={list.id}
                  value={list.id}
                  onSelect={(currentValue) => {
                    onChangeValue(currentValue === value ? undefined : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer border-l-4 border-l-transparent"
                  style={{
                    borderColor: list?.color ?? 'transparent',
                  }}
                >
                  <CheckIcon
                    className={clsx(
                      'mr-2 h-4 w-4',
                      value === list.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {list.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

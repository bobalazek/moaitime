import { clsx } from 'clsx';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@moaitime/web-ui';

import { useTagsStore } from '../../../tasks/state/tagsStore';

export type TagSelectorProps = {
  values?: string[];
  onChangeValue: (values: string[]) => void;
};

export function TagSelector({ values, onChangeValue }: TagSelectorProps) {
  const { tags, addTag } = useTagsStore();
  const [open, setOpen] = useState(false);
  const [commandValue, setCommandValue] = useState('');

  const selectedTags = tags.filter((tag) => values?.includes(tag.id));
  const filteredTags = tags.filter((tag) => tag.name.includes(commandValue));

  const onCreateTag = async () => {
    try {
      const addedTag = await addTag({
        name: commandValue,
      });

      setCommandValue('');

      onChangeValue([...(values ?? []), addedTag.id]);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden"
          data-test="tag-selector--trigger-button"
        >
          <div className="w-full truncate text-left">
            {selectedTags.length > 0 && (
              <span>{selectedTags.map((tag) => tag.name).join(', ')}</span>
            )}
            {selectedTags.length === 0 && (
              <span className="text-muted-foreground">Select tags ...</span>
            )}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="tag-selector">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tags ..."
            value={commandValue}
            onValueChange={setCommandValue}
          />
          <CommandGroup>
            {tags.length === 0 && (
              <CommandItem disabled className="text-muted-foreground">
                No tags found
              </CommandItem>
            )}
            {filteredTags.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.id}
                onSelect={(currentValue) => {
                  const newValues = values?.includes(currentValue)
                    ? values.filter((value) => value !== currentValue) ?? []
                    : [...(values ?? []), currentValue];

                  onChangeValue(newValues);
                }}
                className="cursor-pointer border-l-4 border-l-transparent"
                style={{
                  borderColor: tag?.color ?? 'transparent',
                }}
              >
                <CheckIcon
                  className={clsx(
                    'mr-2 h-4 w-4',
                    selectedTags.includes(tag) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {tag.name}
              </CommandItem>
            ))}
            {filteredTags.length === 0 && commandValue && (
              <CommandItem value={commandValue} onSelect={onCreateTag} className="cursor-pointer">
                <CheckIcon className="mr-2 h-4 w-4" />
                <span>
                  Create <b>"{commandValue}"</b>
                </span>
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

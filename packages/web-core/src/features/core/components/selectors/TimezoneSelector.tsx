import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

import { getTimezones } from '@moaitime/shared-common';
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
  ScrollArea,
} from '@moaitime/web-ui';

const timezones = getTimezones();

export type TimezoneSelectorProps = {
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholderText?: string;
  allowClear?: boolean;
};

export default function TimezoneSelector({
  value,
  onValueChange,
  placeholderText,
  allowClear,
}: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onValueChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-test="timezone-selector--trigger-button"
        >
          {value ?? (
            <span className="text-muted-foreground">
              {placeholderText ?? 'Select timezone ...'}
            </span>
          )}
          {(!allowClear || !value) && <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          {allowClear && value && (
            <span
              className="text-muted-foreground rounded-full p-1 hover:bg-slate-600"
              onClick={onClearButtonClick}
            >
              <FaTimes />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="absolute z-50 p-0" align="start" data-test="timezone-selector">
        <GeneralTimezoneSettingContent
          value={value}
          onValueChange={(newValue) => {
            onValueChange(newValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export const GeneralTimezoneSettingContent = ({ value, onValueChange }: TimezoneSelectorProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) {
      return;
    }

    const selectedValueLowercased = value.toLowerCase();
    const selectedElement = scrollAreaRef.current?.querySelector(
      `div[data-value="${selectedValueLowercased}"]`
    );
    if (!selectedElement) {
      return;
    }

    selectedElement.scrollIntoView({
      block: 'center',
      inline: 'center',
    });
  }, [value]);

  return (
    <Command>
      <CommandInput placeholder="Search timezone ..." />
      <ScrollArea ref={scrollAreaRef} className="h-64" data-test="timezone-selector--content">
        <CommandEmpty>No timezone found</CommandEmpty>
        <CommandGroup>
          {timezones.map((timezone) => (
            <CommandItem
              key={timezone}
              value={timezone}
              onSelect={(newValue) => {
                // Not sure why, but for some reason it's lowercased here, so we want to find the original value
                const selectedTimezone = timezones.find((tz) => tz.toLowerCase() === newValue);
                onValueChange(selectedTimezone!);
              }}
            >
              <FaCheck
                className={clsx('mr-2 h-4 w-4', value === timezone ? 'opacity-100' : 'opacity-0')}
              />
              {timezone}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
};

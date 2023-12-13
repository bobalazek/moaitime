import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

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

export type GeneralTimezoneSettingProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function GeneralTimezoneSetting({
  value,
  onValueChange,
}: GeneralTimezoneSettingProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ?? 'Select timezone ...'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="absolute z-50 p-0" align="start">
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

export const GeneralTimezoneSettingContent = ({
  value,
  onValueChange,
}: GeneralTimezoneSettingProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      <ScrollArea className="h-64" ref={scrollAreaRef}>
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

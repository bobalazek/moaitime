import { clsx } from 'clsx';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

import { TeamUserRoleEnum } from '@moaitime/shared-common';
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

const TEAM_ROLES = [TeamUserRoleEnum.OWNER, TeamUserRoleEnum.ADMIN, TeamUserRoleEnum.MEMBER];

export type TeamRolesSelectorProps = {
  value?: TeamUserRoleEnum[];
  onChangeValue: (value?: TeamUserRoleEnum[]) => void;
};

export function TeamRolesSelector({ value, onChangeValue }: TeamRolesSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedRoles = TEAM_ROLES.filter((role) => value?.includes(role)) ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-test="team-roles-selector--trigger-button"
        >
          <div className="truncate">
            {selectedRoles.length > 0 && <>{selectedRoles.join(', ')}</>}
            {selectedRoles.length === 0 && (
              <span className="text-muted-foreground">Select roles ...</span>
            )}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="team-roles-selector">
        <Command>
          <CommandInput placeholder="Search roles ..." />
          <CommandEmpty>No role found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {TEAM_ROLES.map((role) => (
                <CommandItem
                  key={role}
                  value={role}
                  onSelect={(currentValue) => {
                    const newValues = value?.includes(currentValue as TeamUserRoleEnum)
                      ? value.filter((val) => val !== currentValue) ?? []
                      : [...(value ?? []), currentValue];

                    onChangeValue(newValues as TeamUserRoleEnum[]);
                  }}
                  className="cursor-pointer border-l-4 border-l-transparent"
                >
                  <CheckIcon
                    className={clsx(
                      'mr-2 h-4 w-4',
                      selectedRoles.includes(role) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex gap-2">
                    <span>{role}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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

import { useTeamsStore } from '../../../auth/state/teamsStore';

export type TeamMembersSelectorProps = {
  value?: string[];
  onChangeValue: (value?: string[]) => void;
};

export function TeamMembersSelector({ value, onChangeValue }: TeamMembersSelectorProps) {
  const { joinedTeamMembers } = useTeamsStore();
  const [open, setOpen] = useState(false);

  const selectedTeamMembers =
    joinedTeamMembers.filter((teamMember) => value?.includes(teamMember.userId)) ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-test="team-members-selector--trigger-button"
        >
          <div className="truncate">
            {selectedTeamMembers.length > 0 && (
              <>
                {selectedTeamMembers
                  .map((user) => {
                    return user.user?.displayName ?? user.user?.email ?? 'Unknown user';
                  })
                  .join(', ')}
              </>
            )}
            {selectedTeamMembers.length === 0 && (
              <span className="text-muted-foreground">Select assignees ...</span>
            )}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" data-test="team-members-selector">
        <Command>
          <CommandInput placeholder="Search asignees ..." />
          <CommandEmpty>No asignee found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {joinedTeamMembers.map((teamMember) => (
                <CommandItem
                  key={teamMember.id}
                  value={teamMember.userId}
                  onSelect={(currentValue) => {
                    const newValues = value?.includes(currentValue)
                      ? value.filter((val) => val !== currentValue) ?? []
                      : [...(value ?? []), currentValue];

                    onChangeValue(newValues);
                  }}
                  className="cursor-pointer border-l-4 border-l-transparent"
                >
                  <CheckIcon
                    className={clsx(
                      'mr-2 h-4 w-4',
                      selectedTeamMembers.includes(teamMember) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {teamMember.user?.displayName ?? teamMember.user?.email ?? 'Unknown user'}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

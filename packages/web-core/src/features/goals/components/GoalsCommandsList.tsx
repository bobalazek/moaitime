import { ExternalLinkIcon, TargetIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';

export default function GoalsCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  const goalsEnabled = useAuthUserSetting('goalsEnabled', false);
  if (!goalsEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <TargetIcon className="mr-2" />
          <span className="font-bold">Goals</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/goals');

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Goals</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

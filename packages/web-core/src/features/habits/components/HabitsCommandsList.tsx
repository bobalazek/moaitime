import { ExternalLinkIcon, FilesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';

export default function HabitsCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  const habitsEnabled = useAuthUserSetting('habitsEnabled', false);
  if (!habitsEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <FilesIcon className="mr-2" />
          <span className="font-bold">Habits</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/habits');

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Habits</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

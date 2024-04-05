import { ExternalLinkIcon, SmileIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';

export default function MoodCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  const moodEnabled = useAuthUserSetting('moodEnabled', false);
  if (!moodEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <SmileIcon className="mr-2" />
          <span className="font-bold">Mood</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/mood');

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Mood</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

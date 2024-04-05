import { ExternalLinkIcon, UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useCommandsStore } from '../../commands/state/commandsStore';

export default function SocialCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <UsersIcon className="mr-2" />
          <span className="font-bold">Social</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/social');

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Social</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

import { BellIcon, ExternalLinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useCommandsStore } from '../../commands/state/commandsStore';

export default function NotificationsCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <BellIcon className="mr-2" />
          <span className="font-bold">Notifications</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/notifications');

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Notifications</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

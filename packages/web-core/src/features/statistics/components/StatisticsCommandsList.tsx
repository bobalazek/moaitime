import { BarChart4Icon, ExternalLinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useCommandsStore } from '../../commands/state/commandsStore';

export default function StatisticsCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <BarChart4Icon className="mr-2" />
          <span className="font-bold">Statistics</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/statistics');

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Statistics</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

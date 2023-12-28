import { CogIcon, ExternalLinkIcon } from 'lucide-react';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useCommandsStore } from '../../commands/state/commandsStore';
import { useSettingsStore } from '../state/settingsStore';

export default function SettingsCommandsList() {
  const { setDialogOpen } = useSettingsStore();
  const { setCommandsDialogOpen } = useCommandsStore();

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <CogIcon className="mr-2" />
          <span className="font-bold">Settings</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          setDialogOpen(true);

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Settings</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

import { FilesIcon, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';

export default function NotesCommandsList() {
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  const notesEnabled = useAuthUserSetting('notesEnabled', false);
  if (!notesEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <FilesIcon className="mr-2" />
          <span className="font-bold">Notes</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/notes');

          setCommandsDialogOpen(false);
        }}
      >
        <PlusIcon className="mr-2" />
        <span>
          Open <b>Notes</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

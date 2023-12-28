import { CalendarIcon, CogIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthStore } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';

export default function CalendarCommandsList() {
  const { auth } = useAuthStore();
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();

  const calendarEnabled = !!auth?.user?.settings?.calendarEnabled;

  if (!calendarEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <CogIcon className="mr-2" />
          <span className="font-bold">Calendar</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          navigate('/calendar');

          setCommandsDialogOpen(false);
        }}
      >
        <CalendarIcon className="mr-2" />
        <span>
          Open <b>Calendar</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

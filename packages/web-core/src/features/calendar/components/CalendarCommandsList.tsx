import { FaCalendarAlt, FaCog } from 'react-icons/fa';

import { CommandGroup, CommandItem } from '@myzenbuddy/web-ui';

import { useCommandsStore } from '../../commands/state/commandsStore';
import { useSettingsStore } from '../../settings/state/settingsStore';
import { useCalendarStore } from '../state/calendarStore';

export default function CalendarCommandsList() {
  const {
    settings: { calendarEnabled },
  } = useSettingsStore();
  const { setDialogOpen } = useCalendarStore();
  const { setCommandsDialogOpen } = useCommandsStore();

  if (!calendarEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <FaCog className="mr-2" />
          <span className="font-bold">Calendar</span>
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
        <FaCalendarAlt className="mr-2" />
        <span>
          Open <b>Calendar</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

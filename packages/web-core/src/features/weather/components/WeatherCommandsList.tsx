import { FaExternalLinkAlt } from 'react-icons/fa';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthStore } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';
import { useWeatherStore } from '../state/weatherStore';
import WeatherConditionIcon from './misc/WeatherConditionIcon';

export default function WeatherCommandsList() {
  const { auth } = useAuthStore();
  const { setPopoverOpen } = useWeatherStore();
  const { setCommandsDialogOpen } = useCommandsStore();

  const weatherEnabled = auth?.user?.settings?.weatherEnabled ?? false;

  if (!weatherEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <WeatherConditionIcon className="mr-2" />
          <span className="font-bold">Weather</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          setPopoverOpen(true);

          setCommandsDialogOpen(false);
        }}
      >
        <FaExternalLinkAlt className="mr-2" />
        <span>
          Open <b>Weather</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

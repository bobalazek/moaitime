import { ExternalLinkIcon } from 'lucide-react';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';
import { useWeatherStore } from '../state/weatherStore';
import WeatherConditionIcon from './misc/WeatherConditionIcon';

export default function WeatherCommandsList() {
  const { setPopoverOpen } = useWeatherStore();
  const { setCommandsDialogOpen } = useCommandsStore();

  const weatherEnabled = useAuthUserSetting('weatherEnabled', false);
  if (!weatherEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <WeatherConditionIcon size={20} className="mr-2" />
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
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Weather</b>
        </span>
      </CommandItem>
    </CommandGroup>
  );
}

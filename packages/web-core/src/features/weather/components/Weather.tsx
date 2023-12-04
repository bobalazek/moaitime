import { Popover } from '@radix-ui/react-popover';

import { PopoverContent, PopoverTrigger } from '@myzenbuddy/web-ui';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useWeatherStore } from '../state/weatherStore';
import WeatherBody from './body/WeatherBody';
import WeatherLocationDialog from './dialog/WeatherLocationDialog';
import WeatherConditionIcon from './misc/WeatherConditionIcon';

export default function Weather() {
  const { popoverOpen, setPopoverOpen } = useWeatherStore();

  return (
    <ErrorBoundary>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal={true}>
        <PopoverTrigger asChild>
          <button className="text-xl transition-all hover:text-gray-200" data-test="weather--popover--trigger-button">
            <WeatherConditionIcon className="text-3xl" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="mb-4 w-full" align="end" data-test="weather--popover">
          <WeatherBody />
        </PopoverContent>
        <WeatherLocationDialog />
      </Popover>
    </ErrorBoundary>
  );
}

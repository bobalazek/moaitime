import { Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useWeatherStore } from '../state/weatherStore';
import WeatherBody from './weather-body/WeatherBody';
import WeatherLocationDialog from './weather-location-dialog/WeatherLocationDialog';

export default function WeatherPopover() {
  const { popoverOpen, setPopoverOpen } = useWeatherStore();

  return (
    <ErrorBoundary>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal={true}>
        <PopoverTrigger asChild>
          {/* We need an empty div so it knows where to place that popover */}
          <div className="absolute right-4 top-4" />
        </PopoverTrigger>
        <PopoverContent className="mb-4 w-full" align="end" data-test="weather--popover">
          <WeatherBody />
        </PopoverContent>
        <WeatherLocationDialog />
      </Popover>
    </ErrorBoundary>
  );
}

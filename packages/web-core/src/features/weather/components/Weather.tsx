import type { LucideIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { AppButton } from '../../core/components/AppButton';
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
          <AppButton
            icon={WeatherConditionIcon as LucideIcon}
            title="Open weather"
            data-test="weather--popover--trigger-button"
          />
        </PopoverTrigger>
        <PopoverContent className="mb-4 w-full" align="end" data-test="weather--popover">
          <WeatherBody />
        </PopoverContent>
        <WeatherLocationDialog />
      </Popover>
    </ErrorBoundary>
  );
}

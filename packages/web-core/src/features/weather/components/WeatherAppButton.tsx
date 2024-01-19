import type { LucideIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { useWeatherStore } from '../state/weatherStore';
import WeatherConditionIcon from './WeatherConditionIcon';

export default function WeatherAppButton() {
  const { setPopoverOpen } = useWeatherStore();

  return (
    <AppButton
      icon={WeatherConditionIcon as LucideIcon}
      title="Open weather"
      data-test="weather--popover--trigger-button"
      onClick={() => {
        setPopoverOpen(true);
      }}
    />
  );
}

import { PencilIcon } from 'lucide-react';

import { useWeatherStore } from '../../state/weatherStore';
import WeatherBodyInformation from './WeatherBodyInformation';

export default function WeatherBody() {
  const { weather, setLocationDialogOpen } = useWeatherStore();

  const onEditButtonClick = () => {
    setLocationDialogOpen(true);
  };

  return (
    <div className="min-w-[240px]" data-test="weather--body">
      <h3 className="mb-2 text-xl font-bold">Weather</h3>
      <h4 className="flex items-center text-lg font-bold" data-test="weather--body--location">
        {!weather && <i>Location not set</i>}
        {weather && <span>{weather.location}</span>}
        <button
          className="ml-2"
          onClick={onEditButtonClick}
          data-test="weather--body--location--edit-button"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </h4>
      <WeatherBodyInformation />
    </div>
  );
}

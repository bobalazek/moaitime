import { TiThermometer, TiWeatherWindy } from 'react-icons/ti';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import { useWeatherStore } from '../../state/weatherStore';
import {
  convertCelciusToFahrenheit,
  convertKilometersPerHourToMilesPerHour,
} from '../../utils/WeatherHelpers';
import WeatherConditionIcon from '../misc/WeatherConditionIcon';

export default function WeatherBodyInformation() {
  const {
    settings: { weatherUseMetricUnits },
  } = useSettingsStore();
  const { weather } = useWeatherStore();

  if (!weather) {
    return null;
  }

  const { conditions } = weather;
  const temperature = weatherUseMetricUnits ? (
    <>{weather.temperatureCelsius}°C</>
  ) : (
    <>{convertCelciusToFahrenheit(weather.temperatureCelsius)}°F</>
  );
  const windSpeed = weatherUseMetricUnits ? (
    <>{weather.windSpeedKilometersPerHour} km/h</>
  ) : (
    <>{convertKilometersPerHourToMilesPerHour(weather.windSpeedKilometersPerHour)} mph</>
  );

  return (
    <div className="flex gap-5">
      <h5 className="flex items-center gap-2" data-test="weather--body--information--conditions">
        <WeatherConditionIcon className="text-2xl" />
        <span>{conditions}</span>
      </h5>
      <div className="flex gap-2" data-test="weather--body--information--temperature">
        <TiThermometer className="text-2xl" />
        <span>{temperature}</span>
      </div>
      <div className="flex gap-2" data-test="weather--body--information--windSpeed">
        <TiWeatherWindy className="text-2xl" />
        <span>{windSpeed}</span>
      </div>
    </div>
  );
}

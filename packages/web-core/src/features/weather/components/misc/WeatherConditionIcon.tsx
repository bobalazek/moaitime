import { IconBaseProps } from 'react-icons/lib/cjs';
import {
  TiWeatherCloudy,
  TiWeatherDownpour,
  TiWeatherNight,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherSnow,
  TiWeatherStormy,
  TiWeatherSunny,
  TiWeatherWindy,
  TiWeatherWindyCloudy,
} from 'react-icons/ti';

import { useWeatherStore } from '../../state/weatherStore';

const WeatherConditionIcon: React.FC<IconBaseProps> = ({ ...props }) => {
  const { weather } = useWeatherStore();
  const conditions = weather?.conditions ?? 'Cloudy';

  let FinalWeatherIcon = TiWeatherCloudy;
  if (conditions === 'Downpour') {
    FinalWeatherIcon = TiWeatherDownpour;
  } else if (conditions === 'Night') {
    FinalWeatherIcon = TiWeatherNight;
  } else if (conditions === 'Partly Sunny') {
    FinalWeatherIcon = TiWeatherPartlySunny;
  } else if (conditions === 'Shower') {
    FinalWeatherIcon = TiWeatherShower;
  } else if (conditions === 'Snow') {
    FinalWeatherIcon = TiWeatherSnow;
  } else if (conditions === 'Stormy') {
    FinalWeatherIcon = TiWeatherStormy;
  } else if (conditions === 'Sunny') {
    FinalWeatherIcon = TiWeatherSunny;
  } else if (conditions === 'Windy') {
    FinalWeatherIcon = TiWeatherWindy;
  } else if (conditions === 'Windy Cloudy') {
    FinalWeatherIcon = TiWeatherWindyCloudy;
  }

  return <FinalWeatherIcon {...props} />;
};

export default WeatherConditionIcon;

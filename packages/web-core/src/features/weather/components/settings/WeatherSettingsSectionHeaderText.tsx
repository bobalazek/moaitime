import WeatherConditionIcon from '../misc/WeatherConditionIcon';

export default function WeatherSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <WeatherConditionIcon />
      <span>Weather</span>
    </div>
  );
}

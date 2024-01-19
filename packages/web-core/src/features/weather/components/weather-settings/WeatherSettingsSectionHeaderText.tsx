import WeatherConditionIcon from '../WeatherConditionIcon';

export default function WeatherSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <WeatherConditionIcon className="text-2xl" />
      <span>Weather</span>
    </div>
  );
}

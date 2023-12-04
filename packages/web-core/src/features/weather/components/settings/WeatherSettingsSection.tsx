import { Label, Switch } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import WeatherSettingsSectionHeaderText from './WeatherSettingsSectionHeaderText';

export default function WeatherSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <WeatherSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">All the settings related to the weather widget.</p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-weatherEnabled"
            checked={settings.weatherEnabled}
            onCheckedChange={() => {
              updateSettings({
                weatherEnabled: !settings.weatherEnabled,
              });
            }}
          />
          <Label htmlFor="settings-weatherEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Should we show the weather button?</p>
      </div>
      {settings.weatherEnabled && (
        <div className="mb-4">
          <div className="flex items-center">
            <Switch
              id="settings-weatherUseMetricUnits"
              checked={settings.weatherUseMetricUnits}
              onCheckedChange={() => {
                updateSettings({
                  weatherUseMetricUnits: !settings.weatherUseMetricUnits,
                });
              }}
            />
            <Label htmlFor="settings-weatherUseMetricUnits" className="ml-2">
              Use Metric Units
            </Label>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Should we use the metrics or imperial system? We are not judging, everyone has their own preferences, okay?
          </p>
        </div>
      )}
    </div>
  );
}

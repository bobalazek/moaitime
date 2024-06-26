import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';

export default function WeatherSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const weatherEnabled = useAuthUserSetting('weatherEnabled', false);
  const weatherUseMetricUnits = useAuthUserSetting('weatherUseMetricUnits', false);

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-weatherEnabled"
            checked={weatherEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                weatherEnabled: !weatherEnabled,
              });
            }}
          />
          <Label htmlFor="settings-weatherEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Should we show the weather button?</p>
      </div>
      {weatherEnabled && (
        <div className="mb-4">
          <div className="flex items-center">
            <Switch
              id="settings-weatherUseMetricUnits"
              checked={weatherUseMetricUnits}
              onCheckedChange={() => {
                updateAccountSettings({
                  weatherUseMetricUnits: !weatherUseMetricUnits,
                });
              }}
            />
            <Label htmlFor="settings-weatherUseMetricUnits" className="ml-2">
              Use Metric Units
            </Label>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Should we use the metrics or imperial system? We are not judging, everyone has their own
            preferences, okay?
          </p>
        </div>
      )}
    </div>
  );
}

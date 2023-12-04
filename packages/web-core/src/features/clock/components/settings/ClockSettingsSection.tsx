import { Label, Switch } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import ClockSettingsSectionHeaderText from './ClockSettingsSectionHeaderText';

export default function ClockSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <ClockSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        At some point in time, every one checked what the time is, so we also offer the same feature.
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-clockEnabled"
            checked={settings.clockEnabled}
            onCheckedChange={() => {
              updateSettings({
                clockEnabled: !settings.clockEnabled,
              });
            }}
          />
          <Label htmlFor="settings-clockEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Should we show the clock?</p>
      </div>
      {settings.clockEnabled && (
        <>
          <div className="mb-4">
            <div className="flex items-center">
              <Switch
                id="settings-clockUseDigitalClock"
                checked={settings.clockUseDigitalClock}
                onCheckedChange={() => {
                  updateSettings({
                    clockUseDigitalClock: !settings.clockUseDigitalClock,
                  });
                }}
              />
              <Label htmlFor="settings-clockUseDigitalClock" className="ml-2">
                Use Digital Clock
              </Label>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              In case you are one of those people that still knows how to read an analog clock, we also give you this
              option!
            </p>
          </div>
          {settings.clockUseDigitalClock && (
            <div className="mb-4">
              <div className="flex items-center">
                <Switch
                  id="settings-clockUse24HourClock"
                  checked={settings.clockUse24HourClock}
                  onCheckedChange={() => {
                    updateSettings({
                      clockUse24HourClock: !settings.clockUse24HourClock,
                    });
                  }}
                />
                <Label htmlFor="settings-clockUse24HourClock" className="ml-2">
                  Use 24-hour clock
                </Label>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Counting to 24 may require some practice, so we also give you the option to use the 12-hour clock.
              </p>
            </div>
          )}
          <div className="mb-4">
            <div className="flex items-center">
              <Switch
                id="settings-clockShowSeconds"
                checked={settings.clockShowSeconds}
                onCheckedChange={() => {
                  updateSettings({
                    clockShowSeconds: !settings.clockShowSeconds,
                  });
                }}
              />
              <Label htmlFor="settings-clockShowSeconds" className="ml-2">
                Show seconds
              </Label>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              In case a ticking clock makes you anxious, we also got you here!
            </p>
          </div>
        </>
      )}
    </div>
  );
}

import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import WidgetsSettingsSectionHeaderText from './WidgetsSettingsSectionHeaderText';

export default function WidgetsSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const clockEnabled = useAuthUserSetting('clockEnabled', false);
  const clockUseDigitalClock = useAuthUserSetting('clockUseDigitalClock', false);
  const clockUse24HourClock = useAuthUserSetting('clockUse24HourClock', false);
  const clockShowSeconds = useAuthUserSetting('clockShowSeconds', false);
  const greetingEnabled = useAuthUserSetting('greetingEnabled', false);
  const quoteEnabled = useAuthUserSetting('quoteEnabled', false);
  const searchEnabled = useAuthUserSetting('searchEnabled', false);
  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div className="mb-4">
      <h4 className="text-lg font-bold">
        <WidgetsSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        All the settings related to our start page widgets.
      </p>
      <div className="flex flex-col gap-4">
        {/* Clock */}
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Clock</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Switch
                id="settings-clockEnabled"
                checked={clockEnabled}
                onCheckedChange={() => {
                  updateAccountSettings({
                    clockEnabled: !clockEnabled,
                  });
                }}
              />
              <Label htmlFor="settings-clockEnabled" className="ml-2">
                Enabled
              </Label>
            </div>
            <p className="text-xs text-gray-400">Should we show the clock?</p>
          </div>
          {clockEnabled && (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <Switch
                    id="settings-clockUseDigitalClock"
                    checked={clockUseDigitalClock}
                    onCheckedChange={() => {
                      updateAccountSettings({
                        clockUseDigitalClock: !clockUseDigitalClock,
                      });
                    }}
                  />
                  <Label htmlFor="settings-clockUseDigitalClock" className="ml-2">
                    Use Digital Clock
                  </Label>
                </div>
                <p className="text-xs text-gray-400">
                  In case you are one of those people that still knows how to read an analog clock,
                  we also give you this option!
                </p>
              </div>
              {clockUseDigitalClock && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Switch
                      id="settings-clockUse24HourClock"
                      checked={clockUse24HourClock}
                      onCheckedChange={() => {
                        updateAccountSettings({
                          clockUse24HourClock: !clockUse24HourClock,
                        });
                      }}
                    />
                    <Label htmlFor="settings-clockUse24HourClock" className="ml-2">
                      Use 24-hour clock
                    </Label>
                  </div>
                  <p className="text-xs text-gray-400">
                    Counting to 24 may require some practice, so we also give you the option to use
                    the 12-hour clock.
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <Switch
                    id="settings-clockShowSeconds"
                    checked={clockShowSeconds}
                    onCheckedChange={() => {
                      updateAccountSettings({
                        clockShowSeconds: !clockShowSeconds,
                      });
                    }}
                  />
                  <Label htmlFor="settings-clockShowSeconds" className="ml-2">
                    Show seconds
                  </Label>
                </div>
                <p className="text-xs text-gray-400">
                  In case a ticking clock makes you anxious, we also got you here!
                </p>
              </div>
            </>
          )}
        </div>
        {/* Greeting */}
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Greeting</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Switch
                id="settings-greetingEnabled"
                checked={greetingEnabled}
                onCheckedChange={() => {
                  updateAccountSettings({
                    greetingEnabled: !greetingEnabled,
                  });
                }}
              />
              <Label htmlFor="settings-greetingEnabled" className="ml-2">
                Enabled
              </Label>
            </div>
            <p className="text-xs text-gray-400">Should we have the greeting enabled or not?</p>
          </div>
        </div>
        {/* Quote */}
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Quote</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Switch
                id="settings-quoteEnabled"
                checked={quoteEnabled}
                onCheckedChange={() => {
                  updateAccountSettings({
                    quoteEnabled: !quoteEnabled,
                  });
                }}
              />
              <Label htmlFor="settings-quoteEnabled" className="ml-2">
                Enabled
              </Label>
            </div>
            <p className="text-xs text-gray-400">A quote a day keeps the doctor away!</p>
          </div>
        </div>
        {/* Search */}
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Search</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Switch
                id="settings-searchEnabled"
                checked={searchEnabled}
                onCheckedChange={() => {
                  updateAccountSettings({
                    searchEnabled: !searchEnabled,
                  });
                }}
              />
              <Label htmlFor="settings-searchEnabled" className="ml-2">
                Enabled
              </Label>
            </div>
            <p className="text-xs text-gray-400">Do we want to have the search enabled or not?</p>
          </div>
        </div>
        {/* Commands */}
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Commands</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Switch
                id="settings-commandsEnabled"
                checked={commandsEnabled}
                onCheckedChange={() => {
                  updateAccountSettings({
                    commandsEnabled: !commandsEnabled,
                  });
                }}
              />
              <Label htmlFor="settings-commandsEnabled" className="ml-2">
                Enabled
              </Label>
            </div>
            <p className="text-xs text-gray-400">Should we enable the commands?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

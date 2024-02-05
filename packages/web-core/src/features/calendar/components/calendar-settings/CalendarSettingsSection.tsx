import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';

export default function CalendarSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">
        Just some visual squares to show you what day it is.
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-calendarEnabled"
            checked={settings.calendarEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                calendarEnabled: !settings.calendarEnabled,
              });
            }}
          />
          <Label htmlFor="settings-calendarEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the calendar on not?</p>
      </div>
    </div>
  );
}

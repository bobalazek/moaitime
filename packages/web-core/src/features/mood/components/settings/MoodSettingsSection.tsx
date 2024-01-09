import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import MoodSettingsSectionHeaderText from './MoodSettingsSectionHeaderText';

export default function MoodSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <h4 className="text-lg font-bold">
        <MoodSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Just some visual squares to show you what day it is.
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-moodEnabled"
            checked={settings.moodEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                moodEnabled: !settings.moodEnabled,
              });
            }}
          />
          <Label htmlFor="settings-moodEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Are you in the mood (sorry, not sorry) for some mood tracking?
        </p>
      </div>
    </div>
  );
}

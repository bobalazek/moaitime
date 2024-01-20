import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import FocusSettingsSectionHeaderText from './FocusSettingsSectionHeaderText';

export default function FocusSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <h4 className="text-lg font-bold">
        <FocusSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Just some visual squares to show you what day it is.
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-focusEnabled"
            checked={settings.focusEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                focusEnabled: !settings.focusEnabled,
              });
            }}
          />
          <Label htmlFor="settings-focusEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the focus on not?</p>
      </div>
    </div>
  );
}

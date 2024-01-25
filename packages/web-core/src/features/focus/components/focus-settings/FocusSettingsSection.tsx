import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import FocusSettingsSectionHeaderText from './FocusSettingsSectionHeaderText';

export default function FocusSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const focusEnabled = useAuthUserSetting('focusEnabled', false);
  const focusSoundsEnabled = useAuthUserSetting('focusSoundsEnabled', false);

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
            checked={focusEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                focusEnabled: !focusEnabled,
              });
            }}
          />
          <Label htmlFor="settings-focusEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the focus on not?</p>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-focusSoundsEnabled"
            checked={focusSoundsEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                focusSoundsEnabled: !focusSoundsEnabled,
              });
            }}
          />
          <Label htmlFor="settings-focusSoundsEnabled" className="ml-2">
            Sounds Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Do you want to hear any sounds when starting or updating a focus session?
        </p>
      </div>
    </div>
  );
}

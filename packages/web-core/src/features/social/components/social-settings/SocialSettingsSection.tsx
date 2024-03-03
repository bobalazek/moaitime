import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';

export default function SocialSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const socialEnabled = useAuthUserSetting('socialEnabled', false);

  return (
    <div>
      <p className="mb-4 text-sm text-gray-400">Do you want to enable the social features?</p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-socialEnabled"
            checked={socialEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                socialEnabled: !socialEnabled,
              });
            }}
          />
          <Label htmlFor="settings-socialEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Psst, want to be a little social?</p>
      </div>
    </div>
  );
}

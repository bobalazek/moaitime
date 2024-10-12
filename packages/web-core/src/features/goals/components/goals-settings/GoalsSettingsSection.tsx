import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';

export default function GoalsSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-goalsEnabled"
            checked={settings.goalsEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                goalsEnabled: !settings.goalsEnabled,
              });
            }}
          />
          <Label htmlFor="settings-goalsEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the goals on not?</p>
      </div>
    </div>
  );
}

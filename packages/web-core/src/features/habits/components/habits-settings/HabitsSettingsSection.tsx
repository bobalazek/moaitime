import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';

export default function HabitsSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const habitsEnabled = useAuthUserSetting('habitsEnabled', false);

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-habitsEnabled"
            checked={habitsEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                habitsEnabled: !habitsEnabled,
              });
            }}
          />
          <Label htmlFor="settings-habitsEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Psst, want to track some habits?</p>
      </div>
    </div>
  );
}

import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';

export default function NotesSettingsSection() {
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
            id="settings-notesEnabled"
            checked={settings.notesEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                notesEnabled: !settings.notesEnabled,
              });
            }}
          />
          <Label htmlFor="settings-notesEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want to have the notes on not?</p>
      </div>
    </div>
  );
}

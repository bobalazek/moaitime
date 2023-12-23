import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import NotesSettingsSectionHeaderText from './NotesSettingsSectionHeaderText';

export default function NotesSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const settings = auth?.user?.settings;
  if (!settings) {
    return null;
  }

  return (
    <div>
      <h4 className="text-lg font-bold">
        <NotesSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Just some visual squares to show you what day it is.
      </p>
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

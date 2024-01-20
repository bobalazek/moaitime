import { Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import CommandsSettingsSectionHeaderText from './CommandsSettingsSectionHeaderText';

export default function CommandsSettingsSection() {
  const { updateAccountSettings } = useAuthStore();

  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <CommandsSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        Since we are a productivity tool, we of course also offer you the possibility to use
        commands!
      </p>
      <div className="mb-4">
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
        <p className="mt-2 text-xs text-gray-400">Should we enable the commands?</p>
      </div>
    </div>
  );
}

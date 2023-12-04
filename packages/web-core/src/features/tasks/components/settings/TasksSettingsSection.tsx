import { Label, Switch } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import TasksSettingsSectionHeaderText from './TasksSettingsSectionHeaderText';

export default function TasksSettingsSection() {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <div>
      <h4 className="flex items-center gap-3 text-lg font-bold">
        <TasksSettingsSectionHeaderText />
      </h4>
      <p className="mb-4 text-sm text-gray-400">
        We know that sometimes you brain just needs a break, so we added a list for you!
      </p>
      <div className="mb-4">
        <div className="flex items-center">
          <Switch
            id="settings-tasksEnabled"
            checked={settings.tasksEnabled}
            onCheckedChange={() => {
              updateSettings({
                tasksEnabled: !settings.tasksEnabled,
              });
            }}
          />
          <Label htmlFor="settings-tasksEnabled" className="ml-2">
            Enabled
          </Label>
        </div>
        <p className="mt-2 text-xs text-gray-400">Do you want the feature?</p>
      </div>
    </div>
  );
}

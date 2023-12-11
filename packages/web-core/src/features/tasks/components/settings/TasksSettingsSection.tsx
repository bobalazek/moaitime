import { Label, Switch } from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import TasksSettingsSectionHeaderText from './TasksSettingsSectionHeaderText';

export default function TasksSettingsSection() {
  const { auth, updateAccountSettings } = useAuthStore();

  const tasksEnabled = auth?.user?.settings?.tasksEnabled ?? false;

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
            checked={tasksEnabled}
            onCheckedChange={() => {
              updateAccountSettings({
                tasksEnabled: !tasksEnabled,
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

import { Button, Label, Switch } from '@moaitime/web-ui';

import { useAuthStore, useAuthUserSetting } from '../../../auth/state/authStore';
import { useTagsStore } from '../../state/tagsStore';
import TasksSettingsSectionHeaderText from './TasksSettingsSectionHeaderText';

export default function TasksSettingsSection() {
  const { updateAccountSettings } = useAuthStore();
  const { setTagsDialogOpen } = useTagsStore();

  const tasksEnabled = useAuthUserSetting('tasksEnabled', false);

  const onOpenTagsButtonClick = () => {
    setTagsDialogOpen(true);
  };

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
      <hr className="mb-4" />
      <div className="mb-4">
        <h4 className="text-lg font-bold">Tags</h4>
        <p className="mb-2 text-xs text-gray-400">Want to see what tags you created?</p>
        <Button size="sm" onClick={onOpenTagsButtonClick}>
          View Tags
        </Button>
      </div>
    </div>
  );
}

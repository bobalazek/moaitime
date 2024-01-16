import { SearchIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { useCommandsStore } from '../state/commandsStore';

export default function CommandsAppButton() {
  const { setCommandsDialogOpen } = useCommandsStore();

  return (
    <AppButton
      icon={SearchIcon}
      title="Open tasks"
      data-test="tasks--popover--trigger-button"
      onClick={() => {
        setCommandsDialogOpen(true);
      }}
    />
  );
}

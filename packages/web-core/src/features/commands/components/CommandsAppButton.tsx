import { SearchIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { useCommandsStore } from '../state/commandsStore';

export default function CommandsAppButton() {
  const { setCommandsDialogOpen } = useCommandsStore();

  return (
    <AppButton
      icon={SearchIcon}
      onClick={() => {
        setCommandsDialogOpen(true);
      }}
      title="Commands"
      data-test="commands--dialog--trigger-button"
    />
  );
}

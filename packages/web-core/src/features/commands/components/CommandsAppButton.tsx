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
      style={{
        backgroundImage: 'radial-gradient(circle, #80DEEA 0%, #0097A7 100%)',
      }}
      data-test="commands--open-button"
    />
  );
}

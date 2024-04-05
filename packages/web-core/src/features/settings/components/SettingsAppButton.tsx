import { CogIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { useSettingsStore } from '../state/settingsStore';

export default function SettingsAppButton() {
  const { setDialogOpen } = useSettingsStore();

  return (
    <AppButton
      icon={CogIcon}
      onClick={() => {
        setDialogOpen(true);
      }}
      title="Settings"
      style={{
        backgroundImage: 'radial-gradient(circle, #78909C 0%, #37474F 100%)',
      }}
      data-test="settings--dialog--trigger-button"
    />
  );
}

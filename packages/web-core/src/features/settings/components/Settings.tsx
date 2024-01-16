import { CogIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useSettingsStore } from '../state/settingsStore';

export default function Settings() {
  const { setDialogOpen } = useSettingsStore();

  return (
    <ErrorBoundary>
      <AppButton
        icon={CogIcon}
        onClick={() => {
          setDialogOpen(true);
        }}
        title="Open settings"
        data-test="settings--dialog--trigger-button"
      />
    </ErrorBoundary>
  );
}

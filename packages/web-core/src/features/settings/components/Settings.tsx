import { CogIcon } from 'lucide-react';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useSettingsStore } from '../state/settingsStore';
import SettingsDialog from './SettingsDialog';

export default function Settings() {
  const { setDialogOpen } = useSettingsStore();

  return (
    <ErrorBoundary>
      <button
        className="text-xl text-white transition-all"
        onClick={() => {
          setDialogOpen(true);
        }}
        title="Settings"
        data-test="settings--dialog--trigger-button"
      >
        <CogIcon className="text-3xl" />
      </button>
      <SettingsDialog />
    </ErrorBoundary>
  );
}

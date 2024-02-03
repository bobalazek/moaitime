import { useEffect, useRef } from 'react';

import { GlobalEventsEnum } from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { ErrorBoundary } from '../../../core/components/ErrorBoundary';
import { useEscapeToHome } from '../../../core/hooks/useEscapeToHome';
import { globalEventsEmitter } from '../../../core/state/globalEventsEmitter';
import { useFocusSessionsStore } from '../../state/focusSessionsStore';
import {
  playChangeFocusSessionStageSound,
  playStartFocusSessionSound,
} from '../../utils/FocusSessionHelpers';
import FocusPageHeader from './focus/FocusPageHeader';
import FocusPageMain from './focus/FocusPageMain';

export default function FocusPage() {
  const { reloadCurrentFocusSession } = useFocusSessionsStore();
  const focusSoundsEnabled = useAuthUserSetting('focusSoundsEnabled', false);
  const isInitialized = useRef(false);

  useEscapeToHome();

  useEffect(() => {
    document.title = 'Focus | MoaiTime';
  }, []);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    reloadCurrentFocusSession();
  }, [reloadCurrentFocusSession]);

  useEffect(() => {
    if (!focusSoundsEnabled) {
      return;
    }

    const focusSessionAddedCallback = () => {
      playStartFocusSessionSound();
    };

    const focusSessionUpdatedCallback = () => {
      playChangeFocusSessionStageSound();
    };

    globalEventsEmitter.on(GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED, focusSessionAddedCallback);
    globalEventsEmitter.on(
      GlobalEventsEnum.FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED,
      focusSessionUpdatedCallback
    );

    return () => {
      globalEventsEmitter.off(
        GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED,
        focusSessionAddedCallback
      );
      globalEventsEmitter.off(
        GlobalEventsEnum.FOCUS_FOCUS_SESSION_CURRENT_STAGE_CHANGED,
        focusSessionUpdatedCallback
      );
    };
  }, [focusSoundsEnabled]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col" data-test="focus">
        <FocusPageHeader />
        <FocusPageMain />
      </div>
    </ErrorBoundary>
  );
}

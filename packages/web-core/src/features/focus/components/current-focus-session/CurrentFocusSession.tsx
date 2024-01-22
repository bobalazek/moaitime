import { useEffect, useState } from 'react';

import {
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  getTimer,
} from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useFocusSessionsStore } from '../../state/focusSessionsStore';

export default function CurrentFocusSession() {
  const { currentFocusSession, reloadCurrentFocusSession, updateCurrentFocusSessionStatus } =
    useFocusSessionsStore();

  const totalSeconds = currentFocusSession?.settings.focusDurationSeconds ?? 0;
  const stageProgressSeconds = currentFocusSession?.stageProgressSeconds ?? 0;

  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds - stageProgressSeconds);

  useEffect(() => {
    if (!currentFocusSession || currentFocusSession.status !== FocusSessionStatusEnum.ACTIVE) {
      setRemainingSeconds(0);

      return;
    }

    setRemainingSeconds(totalSeconds - stageProgressSeconds);

    // TODO: interval not always working when running in background, so we will need a way to work around this
    const remainingSecondsInterval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(remainingSecondsInterval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    const pingInterval = setInterval(() => {
      updateCurrentFocusSessionStatus(FocusSessionUpdateActionEnum.PING);
    }, 1000 * 60);

    return () => {
      clearInterval(remainingSecondsInterval);
      clearInterval(pingInterval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFocusSession?.status, currentFocusSession?.stageProgressSeconds]);

  useEffect(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      try {
        await reloadCurrentFocusSession();
      } catch (error) {
        // We are already handling the error by showing a toast message inside in the fetch function
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  if (!currentFocusSession) {
    return null;
  }

  const onPauseButtonClick = () => {
    updateCurrentFocusSessionStatus(FocusSessionUpdateActionEnum.PAUSE);
  };

  const onContinueButtonClick = () => {
    updateCurrentFocusSessionStatus(FocusSessionUpdateActionEnum.CONTINUE);
  };

  const onCompleteButtonClick = () => {
    updateCurrentFocusSessionStatus(FocusSessionUpdateActionEnum.COMPLETE);
  };

  return (
    <div className="mt-12">
      <div className="text-muted-foreground mb-2 text-lg">I am working on</div>
      <h3 className="text-3xl">{currentFocusSession.taskText}</h3>
      <div className="py-8 text-8xl font-bold">{getTimer(remainingSeconds)}</div>
      <div className="flex justify-center gap-2">
        {currentFocusSession.status === FocusSessionStatusEnum.ACTIVE && (
          <Button size="lg" variant="outline" onClick={onPauseButtonClick}>
            Pause
          </Button>
        )}
        {currentFocusSession.status === FocusSessionStatusEnum.PAUSED && (
          <Button size="lg" onClick={onContinueButtonClick}>
            Continue
          </Button>
        )}

        <Button size="lg" variant="destructive" onClick={onCompleteButtonClick}>
          Stop
        </Button>
      </div>
    </div>
  );
}

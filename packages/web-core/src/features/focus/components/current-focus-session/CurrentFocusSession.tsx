import { useEffect, useState } from 'react';

import {
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  getFocusSessionDurationForCurrentStage,
  getTimer,
} from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useFocusSessionsStore } from '../../state/focusSessionsStore';

export default function CurrentFocusSession() {
  const { currentFocusSession, reloadCurrentFocusSession, updateCurrentFocusSessionStatus } =
    useFocusSessionsStore();

  const stageProgressTotalSeconds = currentFocusSession
    ? getFocusSessionDurationForCurrentStage(currentFocusSession)
    : 0;
  const stageProgressSeconds = currentFocusSession?.stageProgressSeconds ?? 0;

  const [remainingSeconds, setRemainingSeconds] = useState(
    stageProgressTotalSeconds - stageProgressSeconds
  );

  useEffect(() => {
    if (!currentFocusSession || currentFocusSession.status !== FocusSessionStatusEnum.ACTIVE) {
      return;
    }

    setRemainingSeconds(stageProgressTotalSeconds - stageProgressSeconds);

    const remainingSecondsInterval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(remainingSecondsInterval);
          reloadCurrentFocusSession();

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
      <div className="text-3xl">{currentFocusSession.taskText}</div>
      <div className="text-muted-foreground mt-8 text-lg">Stage</div>
      <div className="text-3xl">
        {currentFocusSession.stage}{' '}
        <small className="text-lg">#{currentFocusSession.stageIteration}</small>
      </div>
      <div className="my-8 text-8xl font-bold">{getTimer(remainingSeconds)}</div>
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

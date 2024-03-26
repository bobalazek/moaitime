import { useEffect, useState } from 'react';

import {
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  getFocusSessionDurationForCurrentStage,
  getTimer,
} from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useFocusSessionsStore } from '../../state/focusSessionsStore';
import { getTitleText } from '../../utils/FocusSessionHelpers';

export const FocusSessionStage = ({ stage }: { stage: FocusSessionStageEnum }) => {
  if (stage === FocusSessionStageEnum.SHORT_BREAK) {
    return (
      <div className="text-6xl">
        <div className="mb-2">☕</div>
        <div>Short Break</div>
      </div>
    );
  } else if (stage === FocusSessionStageEnum.LONG_BREAK) {
    return (
      <div className="text-6xl">
        <div className="mb-2">🌇</div>
        <div>Long Break</div>
      </div>
    );
  }

  return (
    <div className="text-6xl">
      <div className="mb-2">🧘</div>
      <div>Focus</div>
    </div>
  );
};

export default function CurrentFocusSession() {
  const {
    currentFocusSession,
    setCurrentFocusSession,
    reloadCurrentFocusSession,
    triggerCurrentFocusSessionAction,
  } = useFocusSessionsStore();
  const [totalSeconds, setTotalSeconds] = useState(
    getFocusSessionDurationForCurrentStage(currentFocusSession)
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    getFocusSessionDurationForCurrentStage(currentFocusSession) -
      (currentFocusSession?.stageProgressSeconds ?? 0)
  );

  const remainingSecondsTimer = getTimer(remainingSeconds);
  const totalSecondsTimer = getTimer(totalSeconds);

  useEffect(() => {
    document.title = getTitleText(remainingSecondsTimer, currentFocusSession ?? undefined);
  }, [currentFocusSession, remainingSecondsTimer]);

  useEffect(() => {
    if (currentFocusSession?.completedAt) {
      setCurrentFocusSession(null);
      return;
    }

    const newTotalSeconds = getFocusSessionDurationForCurrentStage(currentFocusSession);
    const newRemainingSeconds = newTotalSeconds - (currentFocusSession?.stageProgressSeconds ?? 0);

    setTotalSeconds(newTotalSeconds);
    setRemainingSeconds(newRemainingSeconds);

    if (!currentFocusSession || currentFocusSession.status !== FocusSessionStatusEnum.ACTIVE) {
      return;
    }

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
      triggerCurrentFocusSessionAction(FocusSessionUpdateActionEnum.PING);
    }, 1000 * 60);

    return () => {
      clearInterval(remainingSecondsInterval);
      clearInterval(pingInterval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentFocusSession?.status,
    currentFocusSession?.stageProgressSeconds,
    currentFocusSession?.completedAt,
  ]);

  useEffect(() => {
    const onVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      try {
        await reloadCurrentFocusSession();
      } catch (error) {
        // Already handled by the fetch function
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

  const onSkipButtonClick = () => {
    triggerCurrentFocusSessionAction(FocusSessionUpdateActionEnum.SKIP);
  };

  const onPauseButtonClick = () => {
    triggerCurrentFocusSessionAction(FocusSessionUpdateActionEnum.PAUSE);
  };

  const onContinueButtonClick = () => {
    triggerCurrentFocusSessionAction(FocusSessionUpdateActionEnum.CONTINUE);
  };

  const onCompleteButtonClick = () => {
    triggerCurrentFocusSessionAction(FocusSessionUpdateActionEnum.COMPLETE);
  };

  return (
    <div className="mt-12">
      <div className="text-muted-foreground text-lg">I am focusing on</div>
      <div className="text-3xl">{currentFocusSession.taskText}</div>
      <div className="mb-4 mt-8">
        <FocusSessionStage stage={currentFocusSession.stage} />
      </div>
      <div className="mb-4 text-8xl font-bold" title={`Total: ${totalSecondsTimer}`}>
        {remainingSecondsTimer}
      </div>
      <div className="text-muted-foreground mb-8 text-sm">
        Iteration #{currentFocusSession.stageIteration} out of{' '}
        {currentFocusSession.settings.focusRepetitionsCount}
      </div>
      <div className="flex justify-center gap-2">
        <Button size="lg" variant="outline" onClick={onSkipButtonClick}>
          Skip
        </Button>
        {currentFocusSession.status === FocusSessionStatusEnum.ACTIVE && (
          <Button size="lg" variant="outline" onClick={onPauseButtonClick}>
            Pause
          </Button>
        )}
        {currentFocusSession.status === FocusSessionStatusEnum.PAUSED && (
          <Button size="lg" variant="outline" onClick={onContinueButtonClick}>
            Continue
          </Button>
        )}
        <Button size="lg" onClick={onCompleteButtonClick}>
          Complete
        </Button>
      </div>
    </div>
  );
}

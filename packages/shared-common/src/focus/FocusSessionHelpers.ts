import { FocusSession } from './FocusSessionSchema';
import { FocusSessionStageEnum } from './FocusSessionStageEnum';

export const getFocusSessionDurationForCurrentStage = (
  focusSession?: Pick<FocusSession, 'stage' | 'settings'> | null
) => {
  if (!focusSession) {
    return 0;
  }

  const focusSessionStage = focusSession.stage;

  const focusSessionFocusStageDurationSeconds = focusSession.settings?.focusDurationSeconds ?? 0;
  const focusSessionShortBreakStageDurationSeconds =
    focusSession.settings?.shortBreakDurationSeconds ?? 0;
  const focusSessionLongBreakStageDurationSeconds =
    focusSession.settings?.longBreakDurationSeconds ?? 0;

  return focusSessionStage === FocusSessionStageEnum.FOCUS
    ? focusSessionFocusStageDurationSeconds
    : focusSessionStage === FocusSessionStageEnum.SHORT_BREAK
      ? focusSessionShortBreakStageDurationSeconds
      : focusSessionStage === FocusSessionStageEnum.LONG_BREAK
        ? focusSessionLongBreakStageDurationSeconds
        : 0;
};

import { FocusSessionStatusEnum, FocusSessionUpdateActionEnum } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useFocusSessionsStore } from '../../state/focusSessionsStore';

export default function CurrentFocusSession() {
  const { currentFocusSession, updateCurrentFocusSessionStatus } = useFocusSessionsStore();
  if (!currentFocusSession) {
    return null;
  }

  const onPauseButtonClick = () => {
    updateCurrentFocusSessionStatus(FocusSessionUpdateActionEnum.PAUSE);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-3xl">{currentFocusSession.taskText}</h3>
      {currentFocusSession.status === FocusSessionStatusEnum.ACTIVE && (
        <div>
          <Button size="lg" onClick={onPauseButtonClick}>
            Pause
          </Button>
        </div>
      )}
    </div>
  );
}

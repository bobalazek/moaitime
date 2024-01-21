import { FocusSessionStatusEnum, FocusSessionUpdateActionEnum } from '@moaitime/shared-common';
import { Button } from '@moaitime/web-ui';

import { useFocusSessionsStore } from '../../state/focusSessionsStore';

export default function ActiveFocusSession() {
  const { activeFocusSession, updateActiveFocusSessionStatus } = useFocusSessionsStore();
  if (!activeFocusSession) {
    return null;
  }

  const onPauseButtonClick = () => {
    updateActiveFocusSessionStatus(FocusSessionUpdateActionEnum.PAUSE);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-3xl">{activeFocusSession.taskText}</h3>
      {activeFocusSession.status === FocusSessionStatusEnum.ACTIVE && (
        <div>
          <Button size="lg" onClick={onPauseButtonClick}>
            Pause
          </Button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';

import { useAuthStore, useAuthUserSetting } from '../../auth/state/authStore';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';

export default function Clock() {
  const { updateAccountSettings } = useAuthStore();
  const [time, setTime] = useState(new Date());

  const clockUseDigitalClock = useAuthUserSetting('clockUseDigitalClock', false);
  const clockUse24HourClock = useAuthUserSetting('clockUse24HourClock', false);
  const clockShowSeconds = useAuthUserSetting('clockShowSeconds', false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div
        className="select-none"
        data-test="clock"
        onDoubleClick={() => {
          updateAccountSettings({
            clockUseDigitalClock: !clockUseDigitalClock,
          });
        }}
      >
        {clockUseDigitalClock && (
          <DigitalClock
            time={time}
            use24HourClock={clockUse24HourClock}
            showSeconds={clockShowSeconds}
          />
        )}
        {!clockUseDigitalClock && <AnalogClock time={time} showSeconds={clockShowSeconds} />}
      </div>
    </ErrorBoundary>
  );
}

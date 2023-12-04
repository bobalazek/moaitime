import { useEffect, useState } from 'react';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useSettingsStore } from '../../settings/state/settingsStore';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';

export default function Clock() {
  const { settings } = useSettingsStore();
  const [time, setTime] = useState(new Date());

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
      <div className="select-none" data-test="clock">
        {settings.clockUseDigitalClock && (
          <DigitalClock
            time={time}
            use24HourClock={settings.clockUse24HourClock}
            showSeconds={settings.clockShowSeconds}
          />
        )}
        {!settings.clockUseDigitalClock && (
          <AnalogClock time={time} showSeconds={settings.clockShowSeconds} />
        )}
      </div>
    </ErrorBoundary>
  );
}

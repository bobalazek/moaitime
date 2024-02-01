import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useAuthStore, useAuthUserSetting } from '../../auth/state/authStore';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

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
      <AnimatePresence>
        <motion.div
          layout
          initial="initial"
          animate="animate"
          exit="exit"
          variants={animationVariants}
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
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarYearlyViewMonth from './yearly/CalendarYearlyViewMonth';

export default function CalendarYearlyView() {
  const { selectedDate } = useCalendarStore();
  const prevSelectedDateRef = useRef(selectedDate);

  useEffect(() => {
    prevSelectedDateRef.current = selectedDate;
  }, [selectedDate]);

  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => new Date(selectedDate.getFullYear(), i, 1));
  const isFuture = selectedDate > prevSelectedDateRef.current;
  const animationVariants = {
    initial: {
      opacity: 0,
      y: isFuture ? 800 : -800,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: isFuture ? -800 : 800,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex w-full select-none flex-wrap border" data-test="calendar--yearly-view">
      <AnimatePresence>
        {months.map((month) => {
          const monthKey = `${month.getFullYear()}-${month.getMonth()}`;

          return (
            <motion.div
              key={monthKey}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              className="flex w-full p-4 md:w-1/3 lg:w-1/4"
            >
              <CalendarYearlyViewMonth month={month} now={now} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

import { EventInterface } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';
import { getEventsForDay, getWeeksForMonth } from '../../utils/CalendarHelpers';
import CalendarMonthlyViewDay from './monthly/CalendarMonthlyViewDay';

export default function CalendarMonthlyView() {
  const { events, selectedDate } = useCalendarStore();
  const { auth } = useAuthStore();
  const calendarStartDayOfWeek = auth?.user?.settings?.calendarStartDayOfWeek ?? 0;
  const weeks = useMemo(() => {
    return getWeeksForMonth(selectedDate, calendarStartDayOfWeek);
  }, [selectedDate, calendarStartDayOfWeek]);
  const eventsPerDay = useMemo(() => {
    const newEventsPerDay = new Map<string, EventInterface[]>();
    weeks.forEach((week) => {
      week.forEach((day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        const eventsForDay = getEventsForDay(day, events, 'all');

        newEventsPerDay.set(dayKey, eventsForDay);
      });
    });

    return newEventsPerDay;
  }, [weeks, events]);
  const daysOfWeek = useMemo(() => {
    return weeks?.[0]?.map((day) => format(day, 'eee.')) ?? [];
  }, [weeks]);
  const prevSelectedDateRef = useRef(selectedDate);

  const now = new Date();
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

  useEffect(() => {
    prevSelectedDateRef.current = selectedDate;
  }, [selectedDate]);

  return (
    <div className="flex w-full flex-col border" data-test="calendar--monthly-view">
      <div className="hidden flex-shrink text-center lg:flex">
        {daysOfWeek.map((dayOfWeek) => (
          <div
            key={dayOfWeek}
            className="w-0 flex-grow border p-2 text-xs font-bold uppercase"
            data-test="calendar--monthly-view--day-of-week"
          >
            {dayOfWeek}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {weeks.map((week, weekIndex) => {
          const weekKey = `${format(week[0], 'yyyy-MM-dd')}---${format(
            selectedDate,
            'yyyy-MM-dd'
          )}`;

          return (
            <motion.div
              key={weekKey}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              className="flex-grow lg:flex"
            >
              {week.map((day, weekDayIndex) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const isFirstWeeksDay = weekIndex === 0 && weekDayIndex === 0;
                const eventsForDay = eventsPerDay.get(dayKey) || [];

                return (
                  <CalendarMonthlyViewDay
                    key={dayKey}
                    day={day}
                    now={now}
                    events={eventsForDay}
                    isFirstWeeksDay={isFirstWeeksDay}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

import { clsx } from 'clsx';
import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CalendarViewEnum, EventWithVerticalPosition, getGmtOffset } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';
import { getEventsForDay } from '../../utils/CalendarHelpers';
import CalendarEvent from '../events/CalendarEvent';
import CalendarWeeklyViewDay from './weekly/CalendarWeeklyViewDay';

type EventsPerDay = {
  withouFullDay: EventWithVerticalPosition[];
  fullDayOnly: EventWithVerticalPosition[];
};

const HOUR_HEIGHT_PX = 64;

export default function CalendarWeeklyView({ singleDay }: { singleDay?: Date }) {
  const { events, selectedDate, selectedView, setSelectedDate, setSelectedView } =
    useCalendarStore();
  const { auth } = useAuthStore();
  const calendarStartDayOfWeek = auth?.user?.settings?.calendarStartDayOfWeek ?? 0;
  const generalTimezone = auth?.user?.settings?.generalTimezone ?? 'UTC';
  const prevSelectedDateRef = useRef(selectedDate);
  const days = useMemo(() => {
    return singleDay
      ? [singleDay]
      : eachDayOfInterval({
          start: startOfWeek(selectedDate, { weekStartsOn: calendarStartDayOfWeek }),
          end: endOfWeek(selectedDate, { weekStartsOn: calendarStartDayOfWeek }),
        });
  }, [singleDay, calendarStartDayOfWeek, selectedDate]);

  const eventsPerDay = useMemo(() => {
    const newEventsPerDay = new Map<string, EventsPerDay>();
    for (const day of days ?? []) {
      const date = format(day, 'yyyy-MM-dd');
      const withouFullDay = getEventsForDay(day, events, 'without-full-day');
      const fullDayOnly = getEventsForDay(day, events, 'full-day-only');

      newEventsPerDay.set(date, { fullDayOnly, withouFullDay });
    }

    return newEventsPerDay;
  }, [days, events]);

  const now = new Date();
  const timezone = getGmtOffset(generalTimezone);
  const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}:00` : `${i}:00`));
  const isFuture = selectedDate > prevSelectedDateRef.current;
  const animationVariants = {
    initial: {
      opacity: 0,
      x: isFuture ? -800 : 800,
      height: 0,
    },
    animate: {
      opacity: 1,
      x: 0,
      height: 'auto',
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      x: isFuture ? 800 : -800,
      height: 0,
      transition: { duration: 0.5 },
    },
  };

  const onResize = useCallback(() => {
    if (!singleDay && window.innerWidth < 1024) {
      setSelectedView(CalendarViewEnum.MONTH);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleDay]);

  const onDayClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedView(CalendarViewEnum.DAY);
  };

  useEffect(() => {
    prevSelectedDateRef.current = selectedDate;
  }, [selectedDate]);

  // Do not allow this weekly view be set if viewport smaller than 768px
  useEffect(() => {
    onResize();
  }, [onResize, selectedView]);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <div className="flex w-full flex-col border" data-test="calendar--weekly-view">
      <div className="flex">
        <div
          className="flex w-28 flex-col justify-end border p-2 text-right text-xs"
          data-test="calendar--weekly-view--timezone"
        >
          {timezone}
        </div>
        <AnimatePresence>
          {days.map((day) => {
            const dayOfWeek = format(day, 'eee.');
            const dayOfMonth = day.getDate();
            const date = format(day, 'yyyy-MM-dd');
            const isActive = date === format(now, 'yyyy-MM-dd');
            const fullDayEvents = eventsPerDay.get(date)?.fullDayOnly ?? [];

            return (
              <motion.div
                key={date}
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className="flex-1 border p-2"
              >
                <div className="text-center text-xs font-bold uppercase">
                  <div data-test="calendar--monthly-view--day-of-week">{dayOfWeek}</div>
                  <div className="mt-1" data-test="calendar--monthly-view--day-of-month">
                    <button
                      className={clsx(
                        'hover:text-primary rounded-full px-2 py-1 text-2xl transition-all hover:bg-gray-600',
                        isActive && 'bg-primary text-accent'
                      )}
                      onClick={() => onDayClick(day)}
                    >
                      {dayOfMonth}
                    </button>
                  </div>
                </div>
                {fullDayEvents.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {fullDayEvents.map((event) => {
                      return <CalendarEvent key={event.id} event={event} />;
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="relative flex flex-1">
        <div className="absolute left-0 top-0 h-full w-full">
          {hours.map((hour) => {
            return <div className="border-b-2" key={hour} style={{ height: HOUR_HEIGHT_PX }} />;
          })}
        </div>
        <div className="w-28 flex-shrink-0">
          {hours.map((hour, index) => {
            return (
              <div
                key={hour}
                className="flex border-b text-xs"
                style={{
                  height: HOUR_HEIGHT_PX,
                }}
              >
                <div className="flex w-28 items-center justify-end">
                  <div
                    className="bg-background mr-4 w-full text-right"
                    style={{
                      transform: `translateY(-${HOUR_HEIGHT_PX / 2}px)`,
                    }}
                  >
                    {index !== 0 ? hour : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-grow">
          {days.map((day) => {
            const date = format(day, 'yyyy-MM-dd');
            const isActive = isSameDay(day, now);
            const eventsForDay = eventsPerDay.get(date)?.withouFullDay ?? [];

            return (
              <CalendarWeeklyViewDay
                key={date}
                day={day}
                isActive={isActive}
                events={eventsForDay}
                hourHeightPx={HOUR_HEIGHT_PX}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

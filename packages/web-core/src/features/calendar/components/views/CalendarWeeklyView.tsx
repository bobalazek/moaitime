import { clsx } from 'clsx';
import { eachDayOfInterval, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  CalendarEntriesPerDay,
  CalendarViewEnum,
  Event,
  getGmtOffset,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { calendarEventResizingAtom } from '../../state/calendarAtoms';
import { useCalendarStore } from '../../state/calendarStore';
import { useEventsStore } from '../../state/eventsStore';
import { getCalendarEntriesForDay } from '../../utils/CalendarHelpers';
import CalendarEntry from '../calendar-entry/CalendarEntry';
import CalendarWeeklyViewDay from './weekly/CalendarWeeklyViewDay';

export default function CalendarWeeklyView({ singleDay }: { singleDay?: Date }) {
  const { calendarEntries, selectedDate, selectedView, setSelectedDate, setSelectedView } =
    useCalendarStore();
  const { setSelectedEventDialogOpen } = useEventsStore();
  const prevSelectedDateRef = useRef(selectedDate);
  const calendarEventResizing = useAtomValue(calendarEventResizingAtom);

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');
  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const days = useMemo(() => {
    return singleDay
      ? [singleDay]
      : eachDayOfInterval({
          start: startOfWeek(selectedDate, { weekStartsOn: generalStartDayOfWeek }),
          end: endOfWeek(selectedDate, { weekStartsOn: generalStartDayOfWeek }),
        });
  }, [singleDay, generalStartDayOfWeek, selectedDate]);

  const calendarEntriesPerDayMap = useMemo(() => {
    const newCalendarEntriesPerDay = new Map<string, CalendarEntriesPerDay>();
    for (const day of days ?? []) {
      const date = format(day, 'yyyy-MM-dd');
      const withouFullDay = getCalendarEntriesForDay(
        date,
        calendarEntries,
        generalTimezone,
        'without-full-day'
      );
      const fullDayOnly = getCalendarEntriesForDay(
        date,
        calendarEntries,
        generalTimezone,
        'full-day-only'
      );

      newCalendarEntriesPerDay.set(date, { fullDayOnly, withouFullDay });
    }

    return newCalendarEntriesPerDay;
  }, [days, calendarEntries, generalTimezone]);

  const now = new Date();
  const gmtOffset = getGmtOffset(generalTimezone);
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

  const onDayClick = useCallback(
    (day: Date) => {
      setSelectedDate(day);
      setSelectedView(CalendarViewEnum.DAY);
    },
    [setSelectedDate, setSelectedView]
  );

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
    <div className="bg-background flex w-full flex-col border" data-test="calendar--weekly-view">
      <div className="flex">
        <div
          className="flex w-20 flex-col justify-end border border-l-0 border-t-0 p-2 text-right text-[0.65rem]"
          data-test="calendar--weekly-view--timezone"
        >
          <div className="truncate" title={generalTimezone}>
            {generalTimezone}
            <br />
            {gmtOffset}
          </div>
        </div>
        <AnimatePresence>
          {days.map((day, index) => {
            const dayOfWeek = format(day, 'eee.');
            const dayOfMonth = day.getDate();
            const date = format(day, 'yyyy-MM-dd');
            const isLastDayOfWeek = index === days.length - 1;
            const isActive = date === format(now, 'yyyy-MM-dd');
            const fullDayCalendarEntries = calendarEntriesPerDayMap.get(date)?.fullDayOnly ?? [];

            const onDayContainerMoveStart = (event: React.MouseEvent | React.TouchEvent) => {
              if (event.cancelable) {
                event.preventDefault();
                event.stopPropagation();
              }

              const isTouchEvent = event.type.startsWith('touch');
              const dayMidnight = `${format(day, 'yyyy-MM-dd')}T00:00:00.000`;

              if (calendarEventResizing) {
                return;
              }

              const onEnd = () => {
                setSelectedEventDialogOpen(true, {
                  startsAt: dayMidnight,
                  endsAt: dayMidnight,
                  isAllDay: true,
                } as Event);

                document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
              };

              document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
            };

            const onSelectDayButtonMoveStart = (event: React.MouseEvent | React.TouchEvent) => {
              if (event.cancelable) {
                event.preventDefault();
                event.stopPropagation();
              }

              const isTouchEvent = event.type.startsWith('touch');

              if (calendarEventResizing) {
                return;
              }

              const onEnd = () => {
                onDayClick(day);

                document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
              };

              document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
            };

            const dayContainerEvents = {
              onMouseDown: onDayContainerMoveStart,
              onTouchStart: onDayContainerMoveStart,
            };

            const selectDayButtonEvents = {
              onMouseDown: onSelectDayButtonMoveStart,
              onTouchStart: onSelectDayButtonMoveStart,
            };

            return (
              <motion.div
                key={date}
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
                className={clsx(
                  'flex-1 cursor-pointer select-none p-2',
                  !isLastDayOfWeek ? 'border-r' : ''
                )}
                data-calendar-day={date}
                data-test="calendar--weekly-view--day-of-week"
                {...dayContainerEvents}
              >
                <div className="text-center text-xs font-bold uppercase">
                  <div data-test="calendar--monthly-view--day-of-week">{dayOfWeek}</div>
                  <div className="mt-1">
                    <button
                      className={clsx(
                        'hover:text-secondary h-10 w-10 rounded-full text-2xl transition-all hover:bg-gray-600',
                        isActive && 'bg-primary text-accent'
                      )}
                      {...selectDayButtonEvents}
                    >
                      {dayOfMonth}
                    </button>
                  </div>
                </div>
                {fullDayCalendarEntries.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {fullDayCalendarEntries.map((calendarEntry) => {
                      return (
                        <CalendarEntry
                          key={calendarEntry.id}
                          dayDate={date}
                          calendarEntry={calendarEntry}
                        />
                      );
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
            return (
              <div
                className="border-b"
                key={hour}
                style={{ height: CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX }}
              />
            );
          })}
        </div>
        <div className="w-20 flex-shrink-0 select-none">
          {hours.map((hour, index) => {
            return (
              <div
                key={hour}
                className="flex border-b text-xs"
                style={{
                  height: CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
                }}
              >
                <div className="flex w-20 items-center justify-end">
                  <div
                    className="bg-background mr-4 w-full text-right"
                    style={{
                      transform: `translateY(-${CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX / 2}px)`,
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
            const calendarEntriesForDay = calendarEntriesPerDayMap.get(date)?.withouFullDay ?? [];

            return (
              <CalendarWeeklyViewDay
                key={date}
                date={date}
                isActive={isActive}
                calendarEntries={calendarEntriesForDay}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

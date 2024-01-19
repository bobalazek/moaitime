import { clsx } from 'clsx';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { MouseEvent } from 'react';

import {
  CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT,
  CalendarEntry as CalendarEntryType, // We can't have the same name, as it's already used by the component
  CalendarViewEnum,
} from '@moaitime/shared-common';

import { useCalendarStore } from '../../../state/calendarStore';
import { useEventsStore } from '../../../state/eventsStore';
import CalendarEntry from '../../calendar-entry/CalendarEntry';

export type CalendarMonthlyViewDayProps = {
  day: Date;
  now: Date;
  calendarEntries: CalendarEntryType[];
  isFirstWeeksDay: boolean;
};

const animationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
};

export default function CalendarMonthlyViewDay({
  day,
  now,
  calendarEntries,
  isFirstWeeksDay,
}: CalendarMonthlyViewDayProps) {
  const { selectedDate, setSelectedDate, setSelectedView } = useCalendarStore();
  const { setSelectedEventDialogOpen } = useEventsStore();
  const isActive = isSameDay(day, now);
  const isActiveMonth = isSameMonth(day, selectedDate);
  const isFirst = day.getDate() === 1 || isFirstWeeksDay;
  const dateText = format(day, isFirst ? 'd. MMM.' : 'd').toLowerCase();
  const dayOfWeek = format(day, 'eee');
  const date = format(day, 'yyyy-MM-dd');

  const onDayClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedDate(day);
    setSelectedView(CalendarViewEnum.DAY);
  };

  const onDayContainerClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const dayMidnight = `${format(day, 'yyyy-MM-dd')}T00:00:00.000`;

    setSelectedEventDialogOpen(true, {
      startsAt: dayMidnight,
      endsAt: dayMidnight,
      isAllDay: true,
      // TODO: figure out a more optimal way for this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

  const shownCalendarEntries = calendarEntries.slice(
    0,
    CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT
  );
  const remainingCalendarEntriesCount = calendarEntries.length - shownCalendarEntries.length;

  return (
    <div
      className="flex-grow cursor-pointer border p-2 lg:w-0"
      onClick={onDayContainerClick}
      data-test="calendar--monthly-view--day"
    >
      <div className="text-center">
        <button
          className={clsx(
            'rounded-full px-2 py-1 text-sm transition-all hover:bg-gray-100 hover:text-black hover:dark:bg-gray-700 hover:dark:text-white lg:h-8 lg:w-8',
            isActive && '!bg-primary !text-accent',
            !isActiveMonth && 'text-gray-300',
            isFirst && 'lg:h-auto lg:w-auto'
          )}
          onClick={onDayClick}
        >
          <span className="mr-0.5 inline-block lg:hidden">{dayOfWeek},</span>
          <span>{dateText}</span>
        </button>
      </div>
      <div className="flex flex-col">
        {shownCalendarEntries.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            <AnimatePresence>
              {shownCalendarEntries.map((calendarEntry) => (
                <motion.div
                  key={calendarEntry.id}
                  layout
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={animationVariants}
                >
                  <CalendarEntry dayDate={date} calendarEntry={calendarEntry} />
                </motion.div>
              ))}
              {remainingCalendarEntriesCount > 0 && (
                <motion.div
                  className="cursor-pointer p-2 text-center text-sm text-gray-400 hover:text-gray-500"
                  onClick={onDayClick}
                >
                  + {remainingCalendarEntriesCount} more
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

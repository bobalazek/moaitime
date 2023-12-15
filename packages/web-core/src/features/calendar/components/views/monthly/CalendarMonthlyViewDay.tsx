import { clsx } from 'clsx';
import { format, isSameDay, isSameMonth } from 'date-fns';

import {
  CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT,
  CalendarEntry,
  CalendarViewEnum,
} from '@moaitime/shared-common';

import { useCalendarStore } from '../../../state/calendarStore';
import CalendarEntryComponent from '../../calendar-entries/CalendarEntry';

export default function CalendarMonthlyViewDay({
  day,
  now,
  calendarEntries,
  isFirstWeeksDay,
}: {
  day: Date;
  now: Date;
  calendarEntries: CalendarEntry[];
  isFirstWeeksDay: boolean;
}) {
  const { selectedDate, setSelectedDate, setSelectedView } = useCalendarStore();
  const isActive = isSameDay(day, now);
  const isActiveMonth = isSameMonth(day, selectedDate);
  const isFirst = day.getDate() === 1;
  const dateText = format(day, isFirst || isFirstWeeksDay ? 'd. MMM.' : 'd').toLowerCase();
  const dayOfWeek = format(day, 'eee');

  const onDayClick = () => {
    setSelectedDate(day);
    setSelectedView(CalendarViewEnum.DAY);
  };

  const shownCalendarEntries = calendarEntries.slice(
    0,
    CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT
  );
  const remainingCalendarEntriesCount = calendarEntries.length - shownCalendarEntries.length;

  return (
    <div className="flex-grow border p-2 lg:w-0" data-test="calendar--monthly-view--day">
      <div className="mb-2 text-center">
        <button
          className={clsx(
            'hover:text-primary rounded-full px-2 py-1 text-sm font-bold transition-all',
            isActive && 'bg-primary text-accent',
            !isActiveMonth && 'text-gray-500',
            isFirst && 'rounded-lg'
          )}
          onClick={onDayClick}
        >
          <span className="inline-block lg:hidden">{dayOfWeek}, </span>
          <span>{dateText}</span>
        </button>
      </div>
      {shownCalendarEntries.length === 0 && (
        <div className="flex flex-grow flex-col items-center justify-center text-xs text-gray-600">
          <span className="text-center">No entries</span>
        </div>
      )}
      {shownCalendarEntries.length > 0 && (
        <div className="flex flex-col gap-1">
          {shownCalendarEntries.map((calendarEntry) => (
            <CalendarEntryComponent key={calendarEntry.id} calendarEntry={calendarEntry} />
          ))}
          {remainingCalendarEntriesCount > 0 && (
            <div
              className="cursor-pointer p-2 text-center text-sm text-gray-400 hover:text-gray-500"
              onClick={onDayClick}
            >
              + {remainingCalendarEntriesCount} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

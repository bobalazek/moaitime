import { clsx } from 'clsx';
import { format, isSameDay, isSameMonth } from 'date-fns';

import {
  CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT,
  CalendarEntry as CalendarEntryType, // We can't have the same name, as it's already used by the component
  CalendarViewEnum,
} from '@moaitime/shared-common';

import { useCalendarStore } from '../../../state/calendarStore';
import CalendarEntry from '../../CalendarEntry';

export default function CalendarMonthlyViewDay({
  day,
  now,
  calendarEntries,
  isFirstWeeksDay,
}: {
  day: Date;
  now: Date;
  calendarEntries: CalendarEntryType[];
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
      <div className="text-center">
        <button
          className={clsx(
            'hover:text-primary rounded-full px-2 py-1 text-sm font-bold transition-all',
            isActive && 'bg-primary text-accent',
            !isActiveMonth && 'text-gray-300',
            isFirst && 'rounded-lg'
          )}
          onClick={onDayClick}
        >
          <span className="inline-block lg:hidden">{dayOfWeek}, </span>
          <span>{dateText}</span>
        </button>
      </div>
      <div className="flex flex-col">
        {shownCalendarEntries.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {shownCalendarEntries.map((calendarEntry) => (
              <CalendarEntry key={calendarEntry.id} calendarEntry={calendarEntry} />
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
    </div>
  );
}

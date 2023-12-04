import { clsx } from 'clsx';
import { format, isSameDay, isSameMonth } from 'date-fns';

import { CalendarViewEnum, EventInterface } from '@myzenbuddy/shared-common';

import { useCalendarStore } from '../../../state/calendarStore';
import CalendarEvent from '../../events/CalendarEvent';

export default function CalendarMonthlyViewDay({
  day,
  now,
  events,
  isFirstWeeksDay,
}: {
  day: Date;
  now: Date;
  events: EventInterface[];
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

  return (
    <div className="flex-grow border p-2 lg:w-0" data-test="calendar--monthly-view--day">
      <div className="mb-2 text-center">
        <button
          className={clsx(
            'hover:text-primary rounded-full px-2 py-1 text-sm font-bold transition-all hover:bg-gray-600',
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
      {events.length === 0 && (
        <div className="flex flex-grow flex-col items-center justify-center text-xs text-gray-600">
          <span className="text-center">No events</span>
        </div>
      )}
      {events.length > 0 && (
        <div className="flex flex-col gap-1">
          {events.map((event) => (
            <CalendarEvent key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

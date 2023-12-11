import { clsx } from 'clsx';
import { format, isSameDay } from 'date-fns';

import { CalendarViewEnum } from '@myzenbuddy/shared-common';

import { useAuthStore } from '../../../../auth/state/authStore';
import { useCalendarStore } from '../../../state/calendarStore';
import { getWeeksForMonth } from '../../../utils/CalendarHelpers';

export default function CalendarYearlyViewMonth({ month, now }: { month: Date; now: Date }) {
  const { setSelectedDate, setSelectedView } = useCalendarStore();
  const { auth } = useAuthStore();
  const calendarStartDayOfWeek = auth?.user?.settings?.calendarStartDayOfWeek ?? 0;
  const monthName = format(month, 'MMMM');
  const weeks = getWeeksForMonth(month, calendarStartDayOfWeek);
  const daysOfWeek = weeks[0].map((day) => format(day, 'eee'));

  const onDayClick = (day: Date) => {
    setSelectedDate(day);
    setSelectedView(CalendarViewEnum.DAY);
  };

  return (
    <div className="w-full border" data-test="calendar--yearly-view--month">
      <div
        className="p-2 text-center text-xl font-bold"
        data-test="calendar--yearly-view--month--name"
      >
        {monthName}
      </div>
      <div className="flex flex-shrink border-b-2 text-center">
        {daysOfWeek.map((dayOfWeek) => (
          <div
            key={dayOfWeek}
            className="w-0 flex-grow p-2 text-xs font-bold uppercase"
            data-test="calendar--yearly-view--month--day-of-week"
          >
            {dayOfWeek}
          </div>
        ))}
      </div>
      <div className="flex flex-col text-center text-xs">
        {weeks.map((week) => {
          const weekKey = `${format(week[0], 'yyyy-MM-dd')}---${format(month, 'yyyy-MM-dd')}`;

          return (
            <div key={weekKey} className="flex">
              {week.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const isSameMonth = day.getMonth() === month.getMonth();
                const isActive = isSameDay(day, now);

                return (
                  <div key={dayKey} className="w-0 flex-grow p-2">
                    <button
                      className={clsx(
                        'hover:text-primary rounded-full px-2 py-1 text-sm transition-all hover:bg-gray-600',
                        !isSameMonth && 'text-gray-500',
                        isActive && 'bg-primary text-accent'
                      )}
                      onClick={() => onDayClick(day)}
                    >
                      {day.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

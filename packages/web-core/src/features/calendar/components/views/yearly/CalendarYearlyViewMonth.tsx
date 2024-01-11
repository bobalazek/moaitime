import { clsx } from 'clsx';
import { format, isSameDay } from 'date-fns';
import { useMemo } from 'react';

import { CalendarViewEnum } from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { useCalendarStore } from '../../../state/calendarStore';
import { getWeeksForMonth } from '../../../utils/CalendarHelpers';

export default function CalendarYearlyViewMonth({ month, now }: { month: Date; now: Date }) {
  const { calendarEntriesYearly, setSelectedDate, setSelectedView } = useCalendarStore();

  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const monthName = format(month, 'MMMM');
  const weeks = getWeeksForMonth(month, generalStartDayOfWeek);
  const daysOfWeek = weeks[0].map((day) => format(day, 'eee'));

  const monthlyEntriesMap = useMemo(() => {
    const entriesMap = new Map<string, number>();

    calendarEntriesYearly.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const entryDateKey = format(entryDate, 'yyyy-MM-dd');

      if (entryDate.getMonth() === month.getMonth()) {
        entriesMap.set(entryDateKey, entry.count);
      }
    });

    return entriesMap;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarEntriesYearly]);

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
      <div className="flex flex-col py-2 text-center text-xs">
        {weeks.map((week) => {
          const weekKey = `${format(week[0], 'yyyy-MM-dd')}---${format(month, 'yyyy-MM-dd')}`;

          return (
            <div key={weekKey} className="flex">
              {week.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const isSameMonth = day.getMonth() === month.getMonth();
                const isActive = isSameDay(day, now);
                const count = monthlyEntriesMap.get(dayKey) ?? 0;
                const hasEntries = count > 0;
                const dateLocal = format(day, 'PPP');
                const title = hasEntries ? `${dateLocal} - ${count} entries` : dateLocal;

                return (
                  <div key={dayKey} className="relative w-0 flex-grow py-2" title={title}>
                    <button
                      className={clsx(
                        'h-8 w-8 rounded-full text-sm transition-all hover:bg-gray-100 hover:text-black hover:dark:bg-gray-700 hover:dark:text-white',
                        !isSameMonth && 'text-gray-300 dark:text-gray-500',
                        isActive && '!bg-primary !text-accent'
                      )}
                      onClick={() => onDayClick(day)}
                    >
                      {day.getDate()}
                    </button>
                    {hasEntries && (
                      <div className="absolute left-[50%] mt-1 h-[6px] w-[6px] -translate-x-[50%] rounded-full bg-red-400"></div>
                    )}
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

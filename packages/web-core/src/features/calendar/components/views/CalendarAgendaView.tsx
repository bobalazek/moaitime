import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { CalendarEntry } from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarAgendaViewDay from './agenda/CalendarAgendaViewDay';

export default function CalendarAgendaView() {
  const { calendarEntries } = useCalendarStore();

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');

  const calendarEntriesPerDay = calendarEntries.reduce(
    (acc, calendarEntry) => {
      const date = format(utcToZonedTime(calendarEntry.startsAt, generalTimezone), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(calendarEntry);
      return acc;
    },
    {} as Record<string, CalendarEntry[]>
  );

  return (
    <div className="flex w-full" data-test="calendar--agenda-view">
      {calendarEntries.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-gray-500">No entries found for this range</span>
        </div>
      )}
      {calendarEntries.length > 0 && (
        <div className="flex flex-1 flex-col space-y-4">
          {Object.keys(calendarEntriesPerDay).map((date) => {
            return (
              <CalendarAgendaViewDay
                key={date}
                date={date}
                calendarEntries={calendarEntriesPerDay[date]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

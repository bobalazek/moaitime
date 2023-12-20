import { CalendarEntry } from '@moaitime/shared-common';

import { useCalendarStore } from '../../../state/calendarStore';
import CalendarAgendaViewDayEventEntry from './CalendarAgendaViewDayEventEntry';

export type CalendarAgendaViewDayProps = {
  date: string;
  calendarEntries: CalendarEntry[];
};

export default function CalendarAgendaViewDay({
  date,
  calendarEntries,
}: CalendarAgendaViewDayProps) {
  const { calendars } = useCalendarStore();

  const dateReadable = new Date(date).toLocaleString('default', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const calendarsMap = new Map(calendars.map((calendar) => [calendar.id, calendar]));

  return (
    <div className="flex flex-col">
      <div className="py-4 text-lg font-bold">{dateReadable}</div>
      <div className="flex flex-col space-y-4">
        {calendarEntries.map((calendarEntry) => {
          return (
            <CalendarAgendaViewDayEventEntry
              key={calendarEntry.id}
              calendarEntry={calendarEntry}
              calendar={calendarsMap.get(calendarEntry.calendarId)}
            />
          );
        })}
      </div>
    </div>
  );
}

import { CalendarEntry } from '@moaitime/shared-common';

import { useTasksStore } from '../../../../tasks/state/tasksStore';
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
  const { lists } = useTasksStore();

  const dateReadable = new Date(date).toLocaleString('default', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const calendarsMap = new Map(calendars.map((calendar) => [calendar.id, calendar]));
  const listsMap = new Map(lists.map((list) => [list.id, list]));

  return (
    <div className="flex flex-col">
      <div className="mb-2 text-lg font-bold">{dateReadable}</div>
      <div className="mb-4 flex flex-col space-y-4">
        {calendarEntries.map((calendarEntry) => {
          const calendar =
            calendarEntry.raw && 'calendarId' in calendarEntry.raw
              ? calendarsMap.get(calendarEntry.raw?.calendarId)
              : undefined;
          const list =
            calendarEntry.raw && 'listId' in calendarEntry.raw
              ? listsMap.get(calendarEntry.raw?.listId)
              : undefined;

          return (
            <CalendarAgendaViewDayEventEntry
              key={calendarEntry.id}
              calendarEntry={calendarEntry}
              calendarOrList={calendar || list}
            />
          );
        })}
      </div>
    </div>
  );
}

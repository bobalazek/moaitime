import { CalendarEntry } from '@moaitime/shared-common';

import { useCalendarStore } from '../../state/calendarStore';
import { useEventsStore } from '../../state/eventsStore';
import CalendarEntryTimes from '../calendar-entry/CalendarEntryTimes';

export default function EventEditDialogBodyReadOnly() {
  const { selectedEvent } = useEventsStore();
  const { calendars, userCalendars } = useCalendarStore();

  if (!selectedEvent) {
    return null;
  }

  let calendar = userCalendars.find(
    (userCalendar) => userCalendar.calendarId === selectedEvent.calendarId
  )?.calendar;
  if (!calendar) {
    calendar = calendars.find((calendar) => calendar.id === selectedEvent.calendarId);
  }

  return (
    <div>
      <h3 className="text-2xl">{selectedEvent.title}</h3>
      <div className="text-muted-foreground text-sm">
        <CalendarEntryTimes calendarEntry={selectedEvent as unknown as CalendarEntry} includeDate />
      </div>
      {selectedEvent.description && (
        <div className="mt-4">
          <h3 className="mb-1 font-bold">Description</h3>
          <p className="text-muted-foreground">{selectedEvent.description}</p>
        </div>
      )}
      {calendar && (
        <div className="mt-4">
          <h3 className="mb-1 font-bold">Calendar</h3>
          <p>{calendar.name}</p>
        </div>
      )}
    </div>
  );
}

import { useCalendarStore } from '../../state/calendarStore';
import { useEventsStore } from '../../state/eventsStore';

export default function EventEditDialogBodyReadOnly() {
  const { selectedEvent } = useEventsStore();
  const { calendars, sharedCalendars } = useCalendarStore();

  if (!selectedEvent) {
    return null;
  }

  let calendar = sharedCalendars.find((c) => c.id === selectedEvent.calendarId);
  if (!calendar) {
    calendar = calendars.find((c) => c.id === selectedEvent.calendarId);
  }

  const date = new Date(selectedEvent.startsAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <h3 className="text-2xl">{selectedEvent.title}</h3>
      <div className="text-muted-foreground text-sm">{date}</div>
      {selectedEvent.description && (
        <div className="mt-2">
          <h3 className="text-lg">Description</h3>
          <p className="text-muted-foreground">{selectedEvent.description}</p>
        </div>
      )}
      {calendar && (
        <div className="mt-2">
          <h3 className="text-lg">Calendar</h3>
          <p>{calendar.name}</p>
        </div>
      )}
    </div>
  );
}

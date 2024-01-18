import { useCalendarStore } from '../../state/calendarStore';
import { useEventsStore } from '../../state/eventsStore';

export default function EventEditDialogBodyReadOnly() {
  const { selectedEvent } = useEventsStore();
  const { calendars, userCalendars } = useCalendarStore();

  if (!selectedEvent) {
    return null;
  }

  let calendar = userCalendars.find((c) => c.id === selectedEvent.calendarId)?.calendar;
  if (!calendar) {
    calendar = calendars.find((c) => c.id === selectedEvent.calendarId);
  }

  const startDate = new Date(selectedEvent.startsAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(selectedEvent.endsAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <h3 className="text-2xl">{selectedEvent.title}</h3>
      <div className="text-muted-foreground text-sm">
        {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
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

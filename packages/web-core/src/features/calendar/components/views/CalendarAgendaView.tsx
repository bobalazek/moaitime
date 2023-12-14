import { utcToZonedTime } from 'date-fns-tz';

import { Event } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';

export default function CalendarAgendaView() {
  const { auth } = useAuthStore();
  const { events } = useCalendarStore();

  const generalTimezone = auth?.user?.settings?.generalTimezone || 'UTC';
  const clockUse24HourClock = auth?.user?.settings?.clockUse24HourClock || false;

  const eventsPerDay = events.reduce(
    (acc, event) => {
      const date = event.startsAt.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );

  return (
    <div className="flex w-full" data-test="calendar--agenda-view">
      {events.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="text-gray-500">No events found for this range</span>
        </div>
      )}
      {events.length && (
        <div className="flex flex-1 flex-col space-y-4">
          {Object.keys(eventsPerDay).map((date) => {
            const dateReadable = new Date(date).toLocaleString('default', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });
            const dayEvents = eventsPerDay[date];

            return (
              <div key={date} className="flex flex-col">
                <div className="py-4 text-lg font-bold">{dateReadable}</div>
                <div className="flex flex-col space-y-4">
                  {dayEvents.map((event) => {
                    const startTime = utcToZonedTime(
                      new Date(event.startsAt),
                      generalTimezone
                    ).toLocaleString('default', {
                      minute: '2-digit',
                      hour: '2-digit',
                      hour12: !clockUse24HourClock,
                    });
                    const endTime = utcToZonedTime(
                      new Date(event.endsAt),
                      generalTimezone
                    ).toLocaleString('default', {
                      minute: '2-digit',
                      hour: '2-digit',
                      hour12: !clockUse24HourClock,
                    });

                    return (
                      <div key={event.id} className="v flex justify-between border p-4">
                        <div className="font-bold">{event.title}</div>
                        <div className="space-y-2">
                          {event.isAllDay && <>All-Day</>}
                          {!event.isAllDay && (
                            <>
                              <div>{startTime}</div>
                              <div>{endTime}</div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

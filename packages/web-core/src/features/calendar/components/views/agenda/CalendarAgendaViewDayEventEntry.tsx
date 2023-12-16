import { differenceInDays, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { CalendarEntry } from '@moaitime/shared-common';

import { useAuthStore } from '../../../../auth/state/authStore';
import { useCalendarStore } from '../../../state/calendarStore';

export type CalendarAgendaViewDayEventEntryProps = {
  calendarEntry: CalendarEntry;
};

export default function CalendarAgendaViewDayEventEntry({
  calendarEntry,
}: CalendarAgendaViewDayEventEntryProps) {
  const { auth } = useAuthStore();
  const { setSelectedCalendarEntryDialogOpen } = useCalendarStore();

  const generalTimezone = auth?.user?.settings?.generalTimezone || 'UTC';
  const clockUse24HourClock = auth?.user?.settings?.clockUse24HourClock || false;

  const start = utcToZonedTime(calendarEntry.startsAt, generalTimezone);
  const startDate = format(start, 'yyyy-MM-dd');
  const startTime = start.toLocaleString('default', {
    minute: '2-digit',
    hour: '2-digit',
    hour12: !clockUse24HourClock,
  });

  const end = utcToZonedTime(calendarEntry.endsAt, generalTimezone);
  const endDate = format(end, 'yyyy-MM-dd');
  const endTime = end.toLocaleString('default', {
    minute: '2-digit',
    hour: '2-digit',
    hour12: !clockUse24HourClock,
  });
  const endDateReadable = end.toLocaleString('default', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const daysDifference = differenceInDays(new Date(endDate), new Date(startDate));

  return (
    <div
      key={calendarEntry.id}
      className="flex cursor-pointer justify-between border p-4"
      onClick={() => {
        setSelectedCalendarEntryDialogOpen(true, calendarEntry);
      }}
    >
      <div>
        <div className="font-bold">{calendarEntry.title}</div>
        {calendarEntry.description && <div className="text-xs">{calendarEntry.description}</div>}
      </div>
      <div className="space-y-2 text-right text-sm">
        {calendarEntry.isAllDay && (
          <>
            {daysDifference <= 1 && <span>All-Day</span>}
            {daysDifference > 1 && <span>{daysDifference} Full-Days</span>}
          </>
        )}
        {!calendarEntry.isAllDay && (
          <>
            <div>{startTime}</div>
            <div>
              {startDate !== endDate ? `${endDateReadable} ` : ''}
              {endTime}
            </div>
          </>
        )}
      </div>
    </div>
  );
}